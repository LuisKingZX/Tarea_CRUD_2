import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Role } from '../model/role.model';
import { User } from '../model/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private token = signal<string | null>(null);
    private currentUser = signal<User | null>(null);

    constructor(private http: HttpClient, private router: Router) {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            this.token.set(storedToken);
            // Aquí podrías hacer una llamada a /me si tu API lo permite
        }
    }

    login(username: string, password: string) {
        return this.http.post<{ token: string }>('/auth/login', { username, password });
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
        this.token.set(token);
        // Aquí podrías también setear el usuario actual si tenés un endpoint como /auth/me
    }

    logout() {
        localStorage.removeItem('token');
        this.token.set(null);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated() {
        return this.token() !== null;
    }

    getToken() {
        return this.token();
    }

    setCurrentUser(user: User) {
        this.currentUser.set(user);
    }

    getCurrentUser() {
        return this.currentUser();
    }

    getRole(): Role | null {
        return this.currentUser()?.role || null;
    }

    isAdmin(): boolean {
        return this.getRole() === 'SUPER_ADMIN_ROLE';
    }
}
