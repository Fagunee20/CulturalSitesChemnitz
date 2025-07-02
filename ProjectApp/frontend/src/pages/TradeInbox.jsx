// ✅ TradeInbox.jsx
import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_MY_TRADE_REQUESTS = gql`
  query MyTradeRequests {
    myTradeRequests {
      id
      fromUser { name }
      offeredPlace { name }
      requestedPlace { name }
      status
      createdAt
    }
  }
`;

const RESPOND_TRADE_REQUEST = gql`
  mutation RespondToTradeRequest($tradeId: ID!, $accept: Boolean!) {
    respondToTradeRequest(tradeId: $tradeId, accept: $accept)
  }
`;

export default function TradeInbox() {
  const { data, loading, error, refetch } = useQuery(GET_MY_TRADE_REQUESTS);
  const [respondToTrade] = useMutation(RESPOND_TRADE_REQUEST);

  const handleResponse = async (tradeId, accept) => {
    try {
      await respondToTrade({ variables: { tradeId, accept } });
      alert(accept ? '✅ Trade accepted!' : '❌ Trade rejected.');
      refetch();
    } catch (err) {
      console.error('Error responding to trade:', err);
      alert('⚠️ Something went wrong.');
    }
  };

  if (loading) return <p>Loading trade requests...</p>;
  if (error) return <p>Error loading requests: {error.message}</p>;

  const requests = data?.myTradeRequests || [];

  return (
    <div className="trade-container">
      <h3 className="trade-title">Incoming Trade Requests</h3>
      {requests.length === 0 ? (
        <p>No incoming requests.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="trade-inbox-card">
            <p>
              <strong>{req.fromUser.name}</strong> wants to trade their <strong>{req.offeredPlace.name}</strong> for your <strong>{req.requestedPlace.name}</strong>
            </p>
            <p className="text-sm text-gray-500">Status: {req.status}</p>
            {req.status === 'pending' && (
              <div className="trade-inbox-buttons">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => handleResponse(req.id, true)}
                >Accept</button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleResponse(req.id, false)}
                >Reject</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}