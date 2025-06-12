import Review from '../models/review.model.js';

export const reviewResolvers = {
  Query: {
    getReviewsByPlace: async (_, { placeId }) => {
      return await Review.find({ place: placeId })
        .populate('user', 'name')
        .sort({ createdAt: -1 });
    }
  },

  Mutation: {
    addReview: async (_, { placeId, rating, comment }, { user }) => {
      if (!user) throw new Error('Unauthorized');

      const review = new Review({
        place: placeId,
        user: user.userId,
        rating,
        comment
      });

      await review.save();
      return review.populate('user', 'name');
    },

    updateReview: async (_, { reviewId, rating, comment }, { user }) => {
      const review = await Review.findById(reviewId);
      if (!review || review.user.toString() !== user.userId) throw new Error('Forbidden');
      review.rating = rating;
      review.comment = comment;
      return await review.save();
    },

    deleteReview: async (_, { reviewId }, { user }) => {
      const review = await Review.findById(reviewId);
      if (!review || review.user.toString() !== user.userId) throw new Error('Forbidden');
      await Review.findByIdAndDelete(reviewId);
      return true;
    }
  },

  Place: {
    averageRating: async (place) => {
      const reviews = await Review.find({ place: place.id || place._id });
      if (reviews.length === 0) return null;

      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      return parseFloat(avg.toFixed(2));
    }
  }
};
