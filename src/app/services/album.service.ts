import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private baseUrl = `${environment.apiUrl}/albums`;

  constructor(private http: HttpClient) { }

  getAllAlbum(): Observable<Album[]>{
    return this.http.get<Album[]>(this.baseUrl);
  }

  findById(id: number): Observable<Album>{
    return this.http.get<Album>(`${this.baseUrl}/${id}`);
  }

  createAlbum(album: Album): Observable <Album>{
    return this.http.post<Album>(this.baseUrl,album);
  }

  updateAlbum(id: number, album: Album): Observable<Album>{
    return this.http.put<Album>(`${this.baseUrl}/${id}`, album);
  }

  deleteAlbum(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  registerArtist(albumId: number, artistId: number): Observable<Album>{
     return this.http.post<Album>(
      `${this.baseUrl}/${albumId}/artists/${artistId}`,
      {}
     )
  }

   registerTrack(albumId: number, trackId: number): Observable<Album>{
     return this.http.post<Album>(
      `${this.baseUrl}/${albumId}/tracks/${trackId}`,
      {}
     )
  }

  dropArtist(albumId: number, artistId: number): Observable <Album>{
    return this.http.post<Album>(
     `${this.baseUrl}/${albumId}/drop/${artistId}`,
     {}
    );
  }

  getAlbumArtist(id: number): Observable <Artist[]>{
    return this.http.get<Artist[]>(`${this.baseUrl}/${id}/artists`);

  }
}
