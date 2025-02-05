import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubApiService } from 'src/app/services/github-api.service';
import { StateService } from 'src/app/services/state.service'; // <-- Add this

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  user: any;
  repos: any[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private githubService: GithubApiService,
    private router: Router,
    private stateService: StateService // <-- Inject service
  ) {}

  async ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username') || '';
    this.isLoading = true;
    try {
      const data = await this.githubService.getUserDetails(username);
      this.user = data.user;
      this.repos = data.repos;
    } catch (error) {
      console.error('Error fetching user details or repositories', error);
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    // Get the current index and navigate back
    const currentIndex = this.stateService.getCurrentIndex();
    const since = this.stateService.getHistory()[currentIndex];

    this.router.navigate(['/'], {
      queryParams: { since: since },
    });
  }
}
