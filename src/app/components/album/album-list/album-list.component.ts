import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { Router } from '@angular/router';
import { Album } from '../../../models/album';
import { Track } from '../../../models/track';
import { Artist } from '../../../models/artist';
import { MATERIAL_IMPORTS } from '../../../material';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-list',
  imports: [MATERIAL_IMPORTS,CommonModule],
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css'
})
export class AlbumListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'country', 'bio', 'birthDate']
  albums: Album[] =[];
  tracks: Track[]=[];
  artists: Artist[]= [];
  errorMessage = '';

  constructor(private svc: AlbumService, public router: Router){}

  ngOnInit(): void {
    this.loadAlbum();
  }

  loadAlbum(): void{
    this.svc.getAllAlbum().subscribe({
      next: (data) => (this.albums = data),
      error: () => (this.errorMessage = 'Error loading scheduled classes'),
    })
  }

  addAlbum(): void{
    this.router.navigate(['/albums/new']);
  }

  editAlbum(album: Album): void{
    if(album.id != null){
      this.router.navigate(['/albums',album.id,'edit'])
    }
  }

  deleteAlbum(album: Album): void{
    if(album.id== null){
      return;
    }
    if(
      confirm(
        `Delete album for artist "${
          album.track.title
        }"?`
      )
    )
    {
      this.svc.deleteAlbum(album.id).subscribe({
         next: () => this.loadAlbum(),
        error: () => (this.errorMessage = 'Error deleting class'),
      });
    }
  }

  manageArtists(album: Album): void{
    if(album.id != null){
      this.router.navigate(['/albums', album.id,'edit']);
    }
  }

  trackByAlbumId(index: number, album: Album): number{
    return album.id? album.id : index;
  }

}
