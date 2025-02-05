import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class GithubApiService {
  private apiUrl = 'https://api.github.com';
  private authToken = environment.githubToken;

  // Function to parse the 'Link' header into an object containing 'next' link
  private parseLinkHeader(linkHeader: string): { [key: string]: string } {
    const links: { [key: string]: string } = {};
    const linkParts = linkHeader.split(',');
    linkParts.forEach((part) => {
      const section = part.split(';');
      const url = section[0].slice(1, -1); // Removing angle brackets
      const rel = section[1] ? section[1].match(/rel="(.*?)"/) : null; // Extracting 'rel' value
      if (rel) {
        links[rel[1]] = url;
      }
    });
    return links;
  }

  // Function to get users with pagination support
  async getUsers(page: number = 1, since: number = 0) {
    const response = await axios.get(`${this.apiUrl}/users`, {
      params: { per_page: 10, page, since },
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'X-Github-Api-Version': '2022-11-28',
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    // Parse pagination links from the 'Link' header
    const linkHeader = response.headers['link'] || '';
    const paginationLinks = this.parseLinkHeader(linkHeader);

    return {
      users: response.data,
      pagination: paginationLinks,
    };
  }

  // Function to get a single user's details (including their repos)
  async getUserDetails(username: string) {
    try {
      const user = await axios.get(`${this.apiUrl}/users/${username}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      const repos = await axios.get(`${this.apiUrl}/users/${username}/repos`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      return { user: user.data, repos: repos.data };
    } catch (error) {
      console.error('Error fetching user details or repositories:', error);
      throw new Error('Failed to fetch user details or repositories.');
    }
  }
}
