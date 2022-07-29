import { Component, OnInit } from '@angular/core';
import { MediaService } from '../../../@theme/services/media.service';

@Component({
  selector: 'ngx-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

  isDesktop:boolean = false;
  private mediaService = new MediaService('(min-width: 768px)');
  constructor() { }

  ngOnInit(): void {
    this.mediaService.match$.subscribe(value => this.isDesktop = value);
  }

}
