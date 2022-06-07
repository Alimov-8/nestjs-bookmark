import { Injectable } from "@nestjs/common";

@Injectable({
    
})
export class AuthService {
    signup() {
        return {msg: "I'm signed up"};
    }

    signin() {
        return {msg: "I'm signed in"};
    }
}