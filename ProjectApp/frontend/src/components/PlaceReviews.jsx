// components/PlaceReviews.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_REVIEWS_BY_PLACE = gql`
  query GetReviewsByPlace($placeId: ID!) {
    getReviewsByPlace(placeId: $placeId) {
      _id
      rating
      comment
      createdAt
      user {
        _id
        name
      }
    }
  }
`;

const ADD_REVIEW = gql`
  mutation AddReview($placeId: ID!, $rating: Int!, $comment: String!) {
    addReview(placeId: $placeId, rating: $rating, comment: $comment) {
      _id
      rating
      comment
      user {
        name
      }
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $rating: Int!, $comment: String!) {
    updateReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
      _id
      rating
      comment
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`;

const PlaceReviews = ({ placeId, currentUserId }) => {
  const { data, loading, error, refetch } = useQuery(GET_REVIEWS_BY_PLACE, {
    variables: { placeId }
  });

  const [addReview] = useMutation(ADD_REVIEW);
  const [updateReview] = useMutation(UPDATE_REVIEW);
  const [deleteReview] = useMutation(DELETE_REVIEW);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateReview({ variables: { reviewId: editingId, rating, comment } });
    } else {
      await addReview({ variables: { placeId, rating, comment } });
    }
    setRating(5);
    setComment('');
    setEditingId(null);
    refetch();
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingId(review._id);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Delete this review?')) {
      await deleteReview({ variables: { reviewId } });
      refetch();
    }
  };

  return (
    <div>
      <h3>Reviews</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <label>Rating: </label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        />
        <br />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          rows={3}
          required
        />
        <br />
        <button type="submit">{editingId ? 'Update' : 'Submit'} Review</button>
        {editingId && <button onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <ul className="space-y-2">
        {data.getReviewsByPlace.map((r) => (
          <li key={r._id} className="bg-gray-100 p-2 rounded">
            <div className="flex justify-between">
              <strong>{r.user.name}</strong>
              <span>{r.rating}/5</span>
            </div>
            <p>{r.comment}</p>
            {r.user._id === currentUserId && (
              <div className="mt-1 space-x-2">
                <button onClick={() => handleEdit(r)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(r._id)} className="text-red-600">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaceReviews;
