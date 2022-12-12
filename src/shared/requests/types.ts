import {Permissions} from '../enums';
import {User} from '../types';

export type FileDeleteRequest = {
  from: string;
  files: string[];
};

export type ContributorAddRequest = {
  folderId: string;
  contributorIds: string[];
  permissions: Permissions[];
};

export type ContributorResponse = {
  content: User[];
  totalContributors: number;
};

export type ContributorExistsRequest = {
  folderId: string;
  contributorId: string;
};
