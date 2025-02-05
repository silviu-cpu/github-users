// import { TestBed } from '@angular/core/testing';
// import { GithubApiService } from './github-api.service';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

// describe('GithubApiService', () => {
//   let service: GithubApiService;
//   let mock: MockAdapter; // Correctly treat it as an instance of MockAdapter

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(GithubApiService);
//     mock = new MockAdapter(axios); // Initialize mock with axios instance
//   });

//   afterEach(() => {
//     mock.reset(); // Ensure mock is reset after each test
//   });

//   it('should fetch users', async () => {
//     const mockData = [
//       {
//         login: 'mojombo',
//         id: 1,
//         avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
//         url: 'https://api.github.com/users/mojombo',
//       },
//       {
//         login: 'defunkt',
//         id: 2,
//         avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
//         url: 'https://api.github.com/users/defunkt',
//       },
//     ];
//     mock
//       .onGet('https://api.github.com/users', {
//         params: { per_page: 10, page: 1 },
//       })
//       .reply(200, mockData);

//     const users = await service.getUsers(1);
//     expect(users).toEqual(mockData);
//   });

//   it('should fetch user details and repositories', async () => {
//     const mockUser = {
//       login: 'mojombo',
//       id: 1,
//       avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
//       url: 'https://api.github.com/users/mojombo',
//       type: 'User',
//     };

//     const mockRepos = [
//       { name: 'repo1', html_url: 'https://github.com/mojombo/repo1' },
//       { name: 'repo2', html_url: 'https://github.com/mojombo/repo2' },
//     ];

//     mock.onGet('https://api.github.com/users/mojombo').reply(200, mockUser);
//     mock
//       .onGet('https://api.github.com/users/mojombo/repos')
//       .reply(200, mockRepos);

//     const data = await service.getUserDetails('mojombo');
//     expect(data.user).toEqual(mockUser);
//     expect(data.repos).toEqual(mockRepos);
//   });

//   it('should handle API errors gracefully', async () => {
//     mock.onGet('https://api.github.com/users/nonexistent').reply(404);

//     try {
//       await service.getUserDetails('nonexistent');
//     } catch (error: any) {
//       expect(error.response.status).toBe(404);
//     }
//   });
// });
