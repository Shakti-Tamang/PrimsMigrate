// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { use } from 'passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from 'src/Prisma/prisma.service';


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     config: ConfigService,
//     private prisma: PrismaService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: config.get('JWT_SECRET'),
//     });
//   }

//   async validate(payload: { sub: string; email: string; roles: string }) {
//     console.log({
//       payload,
//     });
//     const user = await this.prisma.user.findUnique({
//       where: {
//         id: payload.sub,
//       },
//     });
//     delete user.password;
//     console.log(user.roles);
//     return user;
//   }
// }
