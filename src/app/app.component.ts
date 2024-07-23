import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { IgService } from './ig.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Find-The-Imposter';
  constructor(private router: Router, private igService: IgService) {}

  isFileuploadComplete: boolean = false;

  redirectToLink(link: string, e: any): void {
    const index = this.followersThatNotFollowingBack.findIndex(
      (obj: any) => obj.string_list_data[0].href === link
    );
    if (index !== -1) {
      this.followersThatNotFollowingBack.splice(index, 1);
    }
    window.open(link, '_blank');
  }

  onFileChange = async (event: any): Promise<void> => {
    try {
      const file = event.target.files[0];

      if (file) {
        try {
          const jsonContent = await this.igService.readZipFile(file);
          let f = this.igService.extractNonFollowingBackAndNonFollowersBack(
            jsonContent.followers,
            jsonContent.following
          );

          if (f) {
            this.followingThatNotFollowingBack =
              this.igService.followingThatNotFollowingBack;
            this.followersThatNotFollowingBack =
              this.igService.followersThatNotFollowingBack;

            this.isFileuploadComplete = true;
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  followingThatNotFollowingBack!: any[];
  followersThatNotFollowingBack!: any[];
}
