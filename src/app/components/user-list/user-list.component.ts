import { Component, OnInit } from '@angular/core';
import { GithubApiService } from 'src/app/services/github-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service'; // <-- Add this

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  page: number = 1;
  since: number = 0;
  loading: boolean = true;
  errorMessage: string = '';
  paginationLinks: any = {};

  constructor(
    private githubService: GithubApiService,
    private router: Router,
    private route: ActivatedRoute,
    private stateService: StateService // <-- Inject service
  ) {}

  ngOnInit() {
    const since = parseInt(
      this.route.snapshot.queryParamMap.get('since') || '0'
    );
    this.since = since;

    // Initialize history from service or URL
    const history = this.stateService.getHistory();
    if (history[this.stateService.getCurrentIndex()] !== since) {
      this.stateService.resetHistory(since);
    }

    this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const { users, pagination } = await this.githubService.getUsers(
        this.page,
        this.since
      );
      this.users = users;
      this.paginationLinks = pagination;
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.loading = false;
    }
  }

  async nextPage() {
    try {
      if (this.paginationLinks.next) {
        const nextPageUrl = this.paginationLinks.next;
        const nextPage = new URL(nextPageUrl);
        const newSince = parseInt(nextPage.searchParams.get('since') || '0');

        // Update state for forward navigation
        this.stateService.updateHistory(newSince, true);
        this.since = newSince;
        this.page = parseInt(nextPage.searchParams.get('page') || '1');

        await this.loadUsers();

        // Update URL
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { since: this.since },
          queryParamsHandling: 'merge',
        });
      }
    } catch (error) {
      console.error('Error loading next page:', error);
    }
  }

  async prevPage() {
    try {
      const currentIndex = this.stateService.getCurrentIndex();
      if (currentIndex > 0) {
        const prevSince = this.stateService.getHistory()[currentIndex - 1];
        this.since = prevSince;
        this.page = Math.max(1, this.page - 1);

        // Update state for backward navigation
        this.stateService.updateHistory(prevSince, false);

        await this.loadUsers();

        // Update URL
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { since: this.since },
          queryParamsHandling: 'merge',
        });
      }
    } catch (error) {
      console.error('Error loading previous page:', error);
    }
  }

  goToUser(username: string) {
    this.router.navigate(['/user', username], {
      queryParams: { since: this.since },
    });
  }
}
