import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { inject, Injectable } from '@angular/core';


// export const JwtInterceptor :HttpInterceptorFn = (req, next) => {


//   constructor(private authService: AuthService, private router: Router) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem('token');

//     let jwtReq = req;

//     if (token) {
//       jwtReq = req.clone({
//         setHeaders: {
//           authorization: `Bearer ${token}`
//         }
//       });
//     }
//     console.log('JWT Request:', jwtReq);
//     return next.handle(jwtReq).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           this.authService.logout();
//           this.router.navigate(['/login']);
//         }
//         return throwError(() => error);
//       })
//     );
//   }
// }
// export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
//   console.log('INTERCEPTOR FN HIT!');
//   return next(req);
// };
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token');
   const router = inject(Router);
  const authService = inject(AuthService);
  let jwtReq = req;
  if (token) {
    jwtReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(jwtReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

