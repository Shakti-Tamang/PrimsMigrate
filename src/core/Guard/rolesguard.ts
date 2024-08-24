// import {
//     CanActivate,
//     ExecutionContext,
//     Injectable,
//     Logger,
//     UnauthorizedException,
//   } from '@nestjs/common';
//   import { JwtService } from '@nestjs/jwt';
//   import { Observable } from 'rxjs';

//   import { Reflector } from '@nestjs/core';

//   import { parse } from 'url';
// import { PrismaService } from 'src/Prisma/prisma.service';
// import { AuthService } from 'src/module/Auth/service/auth/auth.service';

// import { JwtPayload } from 'jsonwebtoken';
// import { PGDatabaseService } from '../Database/pg.database.service';
  
//   @Injectable()
//   export class RolesGuard implements CanActivate {
//     constructor(
//       private jwtService: JwtService,
//       private prisma: PrismaService,
//       private service: AuthService,
//       private pgDatabaseService: PGDatabaseService,
//     ) {}
  
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       console.log('hello000000');
//       const request: Request = context.switchToHttp().getRequest();
//       const authorizationHeader = request.headers['authorization'];
//       console.log(authorizationHeader);
//       if (!authorizationHeader) {
//         console.log('hello');
//         return false;
//       }
//       if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
//         const token = authorizationHeader.substring('Bearer '.length);
//         try {
//           console.log('sunita' + process.env.JWT_SECRET);
//           const jwtPayload: JwtPayload = this.jwtService.verify(token, {
//             secret: process.env.JWT_SECRET,
//           });
  
//           const userRole: Role[] = jwtPayload.roles;
//           const restaurantId = jwtPayload.restaurant;
//           // const path = request.url.includes('/') ? request.url.split('/')[0] : request.url;
//           const method = request.method.toUpperCase();
//           const parsedUrl = parse(request.url);
//           const entireSegment = parsedUrl.pathname;
//           const segments = entireSegment.split('/').filter(Boolean); // Filter out empty segments
//           const path = segments.length > 0 ? segments[0] : null;
  
//           console.log('method', method);
//           console.log('firsrpath', path);
//           console.log('kkkkkkkkk', jwtPayload, 'pathname', path);
//           console.log('zzzzzzzzzzzzzz', userRole);
//           return await this.checkAuthorization(
//             restaurantId,
//             userRole,
//             path,
//             method,
//           );
//         } catch (error) {
//           throw new UnauthorizedException(error);
//         }
//       } else {
//         throw new UnauthorizedException(
//           'Invalid or missing Authorization Bearer header',
//         );
//       }
  
//       throw new Error('Method not implemented.');
//     }
  
//     private async checkAuthorization(
//       restaurantId: string,
//       roles: Role[],
//       path: string,
//       method: string,
//     ): Promise<boolean> {
//       console.log('hello', roles);
//       // this.logger.debug('Authorization check',{role});
//       try {
//         const authorized =
//           await this.pgDatabaseService.prismaRead.authorization.findFirst({
//             where: {
//               restaurant_id: restaurantId,
//               role: { role: { in: roles } },
//               path: { contains: path },
//               method: { has: method },
//             }, // Update this line
//           });
  
//         console.log('roleuuuuuuuuu', authorized.roleId);
//         console.log('path', authorized.path);
//         console.log('actualpath', path);
//         return !!authorized;
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     // constructor(
//     //   private reflector: Reflector,
//     //   private jwtService: JwtService,
//     // ) {}
  
//     // canActivate(context: ExecutionContext): boolean {
//     //   const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//     //     context.getHandler(),
//     //     context.getClass(),
//     //   ]);
//     //   if (!requiredRoles) {
//     //     return true;
//     //   }
//     //   const request: Request = context.switchToHttp().getRequest();
//     //   const authorizationHeader = request.headers['authorization'];
//     //   if (!authorizationHeader) {
//     //     return false;
//     //   }
//     //   if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
//     //     const token = authorizationHeader.substring('Bearer '.length);
  
//     //     const jwtPayload: jwtPayload = this.jwtService.verify(token, {
//     //       secret: process.env.JWT_SECRET,
//     //     });
//     //     const userRole: Role[] = jwtPayload.roles;
//     //     return requiredRoles.some((role) => userRole.includes(role));
//     //   }
//     // }
//   }
  