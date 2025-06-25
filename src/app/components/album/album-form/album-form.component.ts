import { Album } from '../../../models/album';
import { ArtistService } from './../../../services/artist.service';
import { ArtistListComponent } from './../../artist/artist-list/artist-list.component';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Track } from '../../../models/track';
import { Artist } from '../../../models/artist';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlbumService } from '../../../services/album.service';
import { TrackService } from '../../../services/track.service';

import { CommonModule } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MATERIAL_IMPORTS } from '../../../material';
import { Genre } from '../../../models/GENRE';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';




@Component({
  selector: 'app-album-form',
  imports: [ReactiveFormsModule, CommonModule, MATERIAL_IMPORTS, MatSelectModule,MatDatepickerModule,MatInputModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './album-form.component.html',
  styleUrl: './album-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumFormComponent implements OnInit {

    genres = Object.values(Genre);
    selectedGenre: string = Genre.BLUES;

  albumForm!: FormGroup;

  allTrack: Track[] = [];
  allArtist: Artist[] = [];

  selectedAlbum? : Album;
  registeredArtists: Artist[] = [];
  registeredTracks: Track[] = [];
  isEditMode = false;
  albumId?: number;
  errorMessage = '';
displayedColumns: string[] = ['firstName', 'lastName', 'country','status','drop'];
displayedTrackColumns: string[] = ['id','title','language','duration','releaseDate','producer','status'];

// displayedTrackColumns: string[] = ['title', 'language', 'producer'];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private albumSvc: AlbumService,
    private trackSvc: TrackService,
    private artistSvc: ArtistService

  ){}
  ngOnInit(): void {

    this.albumForm = this.fb.group({
      albumName: ['',[Validators.required]],
      genre: ['',[Validators.required]],

      format: ['',[Validators.required]],
      description: ['',[Validators.required]],
      totalTracks: ['',[Validators.required]]
    });

    this.trackSvc.getAllTrack().subscribe({
      next: (tracks) => this.allTrack = tracks,
      error: () => this.errorMessage = 'Error loading tracks'
    });

    this.artistSvc.findAllArtists().subscribe({
      next: (artists) => this.allArtist = artists,
      error: () => this.errorMessage = 'Error loading artists'
    });

    this.route.paramMap.subscribe(params => {
      const idParam =params.get('id');
      if(idParam){
        this.isEditMode =true;
        this.albumId = +idParam;
        this.loadAlbum(this.albumId);
      }
    });
  }

  loadAlbum(id: number): void {
    this.albumSvc.findById(id).subscribe({
      next:(salbum) => {
        this.albumForm.patchValue({
          //trackId: salbum.track.id,
          albumName: salbum.albumName,
          genre: salbum.genre,
          format: salbum.format,
          description: salbum.description,
          totalTracks: salbum.totalTracks

        });
        console.log(salbum.tracks)
        this.registeredTracks = salbum.tracks || [];

        console.log(salbum.artists)
        this.registeredArtists = salbum.artists || [];


      },
      error:() =>this.errorMessage = 'Error loading albums'
    });

  }

  onSelect(album: Album): void{
   this.selectedAlbum = album;
   this.albumSvc.getAlbumArtist(album.id!).subscribe(
    data => this.allArtist= data
   );

  }

  onSubmit(): void{
    if(this.albumForm.invalid){
      return;
    }

    const formValue =this.albumForm.value;
    const salbumData: Album ={
      track: {id: formValue.trackId} as Track,

      albumName: formValue.albumName,
      genre: formValue.genre,

      format: formValue.format,
      description: formValue.description,
      totalTracks: formValue.totalTracks
    };

    if(this.isEditMode && this.albumId != null){
      salbumData.id =this.albumId;
      this.albumSvc.updateAlbum(this.albumId,salbumData).subscribe({
         next: () => this.router.navigate(['/albums']),
        error: () => this.errorMessage = 'Error updating album'
      });
    }else {
      this.albumSvc.createAlbum(salbumData).subscribe({
         next: () => this.router.navigate(['/albums']),
        error: () => this.errorMessage = 'Error creating album'
      });
    }
  }
cancel(): void {
    this.router.navigate(['/albums']);
  }



  addArtistToAlbum(artistId: number ): void{
    if(!this.albumId) return;
    this.albumSvc.registerArtist(this.albumId, artistId).subscribe({
      next:(updatedAlbum) =>{
        this.registeredArtists = updatedAlbum.artists || [];
      },
      error: () => this.errorMessage = 'Error registering Artist'
    });
  }

  addTrackToAlbum(trackId: number ): void{
    if(!this.albumId) return;
    this.albumSvc.registerTrack(this.albumId, trackId).subscribe({
      next:(updatedAlbum) =>{
        this.registeredTracks = updatedAlbum.tracks || [];
      },
      error: () => this.errorMessage = 'Error registering Track'
    });
  }

  dropArtist(artistId: number): void{
    if(!this.albumId) return;
    this.albumSvc.dropArtist(this.albumId, artistId).subscribe({
      next:(updatedAlbum) =>{
        this.registeredArtists = updatedAlbum.artists || [];
      },
        error: () => this.errorMessage = 'Error dropping student'
    });
  }



   isRegistered(artist: Artist): boolean{
    return this.registeredArtists.some(s=> s.id == artist.id);
  }

   isRegisteredTrack(track: Track): boolean{
    return this.registeredTracks.some(s=> s.id == track.id);
  }




}
