import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { attendenceRepo } from '../../Repository/table.repo';
import { PrismaClient, Role, User } from '@prisma/client';
import { StringUtils } from 'src/common/utils/string.utils';
import * as argon from 'argon2';
import { jwtPayload } from 'src/module/Authrization/interface/jwt.payload';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginDtol } from '../../DTO/shakti.logindto';
import { CreateUserDto } from '../../DTO/shakti.studentinfo';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// HTTP Methods categorized by access levels
const readOnlyMethods = ['GET'];
const partialReadWriteMethods = ['POST'];
const writeMethods = ['DELETE', 'PUT', 'PATCH'];

// Function to create roles if they do not exist in the database
async function createRolesIfNotExist() {
  const roles: Array<Role> = Object.values(Role);
  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { role }
    });

    if (!existingRole) {
      // Role doesn't exist, create it
      const createdRole = await prisma.role.create({
        data: {
          roleId: StringUtils.generateRandomAlphaNumeric(),
          role,
        },
      });
      console.log(`Created role: ${role}`, createdRole);
    }
  }
}

// Helper function to set authorization permissions
function setAuthorizationPermissions(
  roleId: string,
  path: string,
  method: Array<string>,
  userId: string // Added userId parameter
) {
  return {
    id: StringUtils.generateRandomAlphaNumeric(),
    roleId,
    path,
    method,
    userId, // Include userId in the returned object
    
  };
}

// Functions to get permissions for different roles
function getAdminPermissions(roleId: string, userId: string) { // Added userId parameter
  return [
    setAuthorizationPermissions(roleId, '/menus', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
      ...writeMethods,
    ], userId),
    setAuthorizationPermissions(roleId, '/tables', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
      ...writeMethods,
    ], userId),
    setAuthorizationPermissions(roleId, '/orders', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
      ...writeMethods,
    ], userId),
    setAuthorizationPermissions(roleId, '/restaurant', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
      ...writeMethods,
    ], userId),
    setAuthorizationPermissions(roleId, '/bookings', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
      ...writeMethods,
    ], userId),
  ];
}

function getStudentPermissions(roleId: string, userId: string) { // Added userId parameter
  return [
    setAuthorizationPermissions(roleId, '/orders', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
      ...writeMethods,
    ], userId),
    setAuthorizationPermissions(roleId, '/restaurant', [...readOnlyMethods], userId),
    setAuthorizationPermissions(roleId, '/bookings', [...readOnlyMethods], userId),
  ];
}

function getTeacherPermissions(roleId: string, userId: string) { // Added userId parameter
  return [
    setAuthorizationPermissions(roleId, '/orders', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
    ], userId),
    setAuthorizationPermissions(roleId, '/restaurant', [...readOnlyMethods], userId),
    setAuthorizationPermissions(roleId, '/bookings', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
    ], userId),
  ];
}

function getSuperAdminPermissions(roleId: string, userId: string) { // Added userId parameter
  return [
    setAuthorizationPermissions(roleId, '/restaurant', [
      ...readOnlyMethods,
      ...partialReadWriteMethods,
      ...writeMethods,
    ], userId),
  ];
}


@Injectable()
export class AttendenceService {
  constructor(
    private attendence: attendenceRepo,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  // Method to create a user
  async create(dto: User): Promise<string> {
    try {
      const hash = await argon.hash(dto.password); // Hash the password
      const userId = StringUtils.generateRandomAlphaNumeric(); // Generate a random ID

      // Create the user using the repository
      await this.attendence.create({
        ...dto,
        id: userId,
        password: hash,
      });

      return 'Created successfully';
    } catch (error) {
      // Handle error and provide context
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Method for signing up an admin user
  async signupForAdmin(CreateDto: CreateUserDto) {
    const hash = await argon.hash(CreateDto.password);
    const userId = StringUtils.generateRandomAlphaNumeric();
    const restaurantId = StringUtils.generateRandomAlphaNumeric();
  
    await this.attendence.create({
      ...CreateDto,
      id: userId,
      password: hash,
    });
  
    await createRolesIfNotExist();
  
    const adminRoleId = await prisma.role.findFirst({
      where: { role: Role.ADMIN },
      select: { roleId: true },
    });
    const studentRoleId = await prisma.role.findFirst({
      where: { role: Role.STUDENT },
      select: { roleId: true },
    });
    const teacherRoleId = await prisma.role.findFirst({
      where: { role: Role.TEACHER },
      select: { roleId: true },
    });
  
    await this.attendence.create({
      ...CreateDto,
      id: restaurantId,
    });
  
    const permissions = [
      ...getAdminPermissions(adminRoleId.roleId, userId).map((permission) => ({
        ...permission,
        restaurant_id: restaurantId,
      })),
      ...getStudentPermissions(studentRoleId.roleId, userId).map((permission) => ({
        ...permission,
        id: userId,
      })),
      ...getTeacherPermissions(teacherRoleId.roleId, userId).map((permission) => ({
        ...permission,
        id: userId,
      })),
    ];
  
    await prisma.authorization.createMany({
      data: permissions,
    });
  }
  
  // Method for signing in a user
  async signIn(dto: loginDtol) {
    let user;

    if (!dto.email && !dto.password) {
      throw new ForbiddenException('Email or password must be given');
    } else if (dto.password == null) {
      user = await this.attendence.findUnique(dto.email);
    } else {
      user = await this.attendence.findUniqueBypassword(dto.password);
    }

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email, user.roles, user.restaurant_id);
  }

  // Method to sign a token for a user
  async signToken(
    userId: string,
    email: string,
    roles: Role[],
    restaurant: string,
  ): Promise<{ access_token: string; reference_token: string }> {
    const payload = {
      sub: userId,
      email,
      roles,
      restaurant,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '40m',
      secret: secret,
    });

    return {
      access_token: token,
      reference_token: refreshToken,
    };
  }

  // Method to generate a new access token from a refresh token
  async generateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; reference_token: string }> {
    try {
      // Verify the refresh token
      const decoded: jwtPayload = this.jwt.verify(refreshToken);
      return this.signToken(
        decoded.sub,
        decoded.email,
        decoded.roles,
        decoded.user,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token: ' + error);
    }
  }

  // Method to get all users
  async getAll() {
    return await this.attendence.find();
  }

  // Method to get a user by ID
  async getOne(id: string) {
    return await this.attendence.findOne(id);
  }

  // Method to delete a user by ID
  async deleteById(id: string) {
    await this.attendence.delete(id);
  }

  // Method to update a user by ID
  async updateUser(id: string, dto: User) {
    try {
      await this.attendence.update(id, dto);
      return "Edited successfully";
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}
