import { ActivatedRoute, Router } from '@angular/router';
import { Album } from './../../../models/album';
import { Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material';
import { AlbumService } from '../../../services/album.service';

@Component({
  selector: 'app-album-details',
  imports: [MATERIAL_IMPORTS],
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.css'
})
export class AlbumDetailsComponent implements OnInit {
albums?: Album;

constructor(private svc: AlbumService,
  private router: Router,
  private route: ActivatedRoute
){

}
  ngOnInit(): void {
    const id: number = +this.route.snapshot.params['id'];
    this.svc.findById(id).subscribe((a) =>(this.albums =a));
  }


}


