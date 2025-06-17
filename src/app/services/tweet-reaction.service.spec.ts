import { TestBed } from '@angular/core/testing';

import { TweetReactionService } from './tweet-reaction.service';

describe('TweetReactionService', () => {
  let service: TweetReactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetReactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
