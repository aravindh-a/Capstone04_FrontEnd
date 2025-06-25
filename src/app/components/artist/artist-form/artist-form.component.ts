import { MATERIAL_IMPORTS } from './../../../material';
import { ActivatedRoute,  Router } from '@angular/router';
import { ArtistService } from './../../../services/artist.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Artist } from '../../../models/artist';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-artist-form',
  imports: [ReactiveFormsModule, CommonModule, MATERIAL_IMPORTS, MatSelectModule,MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './artist-form.component.html',
  styleUrl: './artist-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistFormComponent implements OnInit{
  artistForm!: FormGroup;
  isEditMode = false;
  artistId?: number;
  errorMessage='';

  constructor(
    private svc: ArtistService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
     this.artistForm = this.fb.group({
      firstName: [``,[Validators.required]],
      lastName: ['',[Validators.required]],
      country: ['',[Validators.required]],
      bio: ['',[Validators.required]],
      birthDate: ['',[Validators.required]]
   });

   this.route.paramMap.subscribe(params => {
    const idParam = params.get('id');
    if(idParam){
      this.isEditMode = true;
      this.artistId = +idParam;
      this.loadArtist(this.artistId);
    }
   });
  }

  loadArtist(id: number): void{
    this.svc.findById(id).subscribe({
      next: (artist: Artist)=> this.artistForm.patchValue(artist),
      error: ()=> this.errorMessage ='Error loading Artist'
    })
  }

  onSubmit(): void {
    if(this.artistForm.invalid){
      return;
    }
    const artistData: Artist ={
      firstName: this.artistForm.value.firstName,
      lastName: this.artistForm.value.lastName,
      country: this.artistForm.value.country,
      bio: this.artistForm.value.bio,
      birthDate: this.artistForm.value.birthDate
    };

    if(this.isEditMode && this.artistId != null){
      artistData.id = this.artistId;
      this.svc.update(this.artistId,artistData).subscribe({
        next: ()=> this.router.navigate(['/artists']),
        error: () => this.errorMessage = 'error updating artist'
      });
    } else {
      this.svc.create(artistData).subscribe({
        next: ()=> this.router.navigate(['/artists']),
        error:() => this.errorMessage = 'Error creating artist'
      });
    }
  }

  cancel():void {
    this.router.navigate(['/artists'])
  }

}
