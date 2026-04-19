import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // Lấy token từ Header (Bearer Token)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // ĐẢM BẢO secretOrKey GIỐNG HỆT VỚI CHUỖI BẠN DÙNG LÚC SIGN TOKEN BÊN AUTH.SERVICE
            secretOrKey: 'khoa-bi-mat', // <-- Sửa lại cho khớp với dự án của bạn
        });
    }

    // Payload chính là cục data đã được giải mã từ Token
    async validate(payload: any) {
        return { sub: payload.sub, email: payload.email, role: payload.role };
    }
}