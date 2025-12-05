import type { Review } from '../app/catalogue-service';

export const seedReviews: Review[] = [
  {
    id: 'r_1',
    rating: 5,
    title: 'Excellent Product!',
    comment:
      'Really loved this, highly recommend. The quality exceeded my expectations.',
    createdAt: new Date('2025-10-15T10:30:00'),
  },
  {
    id: 'r_2',
    rating: 4,
    title: 'Pretty good',
    comment: 'Works as expected with only minor issues. Would buy again.',
    createdAt: new Date('2025-10-14T15:20:00'),
  },
  {
    id: 'r_3',
    rating: 3,
    title: "It's okay",
    comment: 'Average product. Does the job but nothing special.',
    createdAt: new Date('2025-10-13T09:15:00'),
  },
  {
    id: 'r_4',
    rating: 5,
    title: 'Amazing!',
    comment:
      "Best purchase I've made this year. Highly recommended to everyone!",
    createdAt: new Date('2025-10-12T14:45:00'),
  },
  {
    id: 'r_5',
    rating: 2,
    title: 'Not great',
    comment: 'Disappointed with the quality. Expected better for the price.',
    createdAt: new Date('2025-10-11T11:00:00'),
  },
];
