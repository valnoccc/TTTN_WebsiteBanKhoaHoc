import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Gọi logic xác thực mặc định của Passport
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // Nếu có lỗi hoặc không tìm thấy user (không có token), ném lỗi 401
        if (err || !user) {
            throw err || new UnauthorizedException('Bạn cần đăng nhập để thực hiện chức năng này!');
        }
        return user;
    }
}