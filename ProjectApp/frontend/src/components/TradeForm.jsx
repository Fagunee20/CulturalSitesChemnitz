// ✅ TradeForm.jsx
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const TRADE_PLACE = gql`
  mutation TradePlace($givePlaceId: ID!, $receivePlaceId: ID!, $partnerUserId: ID!) {
    tradePlace(givePlaceId: $givePlaceId, receivePlaceId: $receivePlaceId, partnerUserId: $partnerUserId)
  }
`;

const SEND_TRADE_REQUEST = gql`
  mutation SendTradeRequest($toUserId: ID!, $offeredPlaceId: ID!, $requestedPlaceId: ID!) {
    sendTradeRequest(toUserId: $toUserId, offeredPlaceId: $offeredPlaceId, requestedPlaceId: $requestedPlaceId) {
      id
      status
    }
  }
`;

export default function TradeForm({ myPlaces, partnerPlaces, partnerUserId }) {
  const [selectedMyPlace, setSelectedMyPlace] = useState('');
  const [selectedPartnerPlace, setSelectedPartnerPlace] = useState('');
  const [tradeMode, setTradeMode] = useState('request');

  const [tradePlace, { loading: loadingDirect, error: errorDirect }] = useMutation(TRADE_PLACE);
  const [sendTradeRequest, { loading: loadingRequest, error: errorRequest }] = useMutation(SEND_TRADE_REQUEST);

  const handleTrade = async () => {
    if (!selectedMyPlace || !selectedPartnerPlace) {
      return alert('Please select both your place and a partner’s place for trade.');
    }

    try {
      if (tradeMode === 'direct') {
        const res = await tradePlace({
          variables: {
            givePlaceId: selectedMyPlace,
            receivePlaceId: selectedPartnerPlace,
            partnerUserId,
          },
        });
        alert(res.data?.tradePlace ? '✅ Direct trade successful!' : '⚠️ Trade failed.');
      } else {
        const res = await sendTradeRequest({
          variables: {
            toUserId: partnerUserId,
            offeredPlaceId: selectedMyPlace,
            requestedPlaceId: selectedPartnerPlace,
          },
        });
        alert(res.data?.sendTradeRequest?.id ? '✅ Trade request sent!' : '⚠️ Failed to send trade request.');
      }
    } catch (err) {
      console.error('Trade error:', err);
      alert('❌ Trade failed. Please try again.');
    }
  };

  const loading = loadingDirect || loadingRequest;
  const error = errorDirect || errorRequest;

  return (
    <div className="trade-container">
      <h4 className="trade-title">Propose a Trade</h4>

      <div className="trade-section">
        <label className="trade-label">Trade Mode:</label>
        <select className="trade-select" value={tradeMode} onChange={(e) => setTradeMode(e.target.value)}>
          <option value="request">Request-Based Trade</option>
          <option value="direct">Direct Trade (Instant)</option>
        </select>
      </div>

      <div className="trade-section">
        <label className="trade-label">Select one of your places:</label>
        <select className="trade-select" value={selectedMyPlace} onChange={(e) => setSelectedMyPlace(e.target.value)}>
          <option value="">-- Select Your Place --</option>
          {myPlaces.map((place) => (
            <option key={place._id} value={place._id}>{place.name}</option>
          ))}
        </select>
      </div>

      <div className="trade-section">
        <label className="trade-label">Select a partner's place:</label>
        <select className="trade-select" value={selectedPartnerPlace} onChange={(e) => setSelectedPartnerPlace(e.target.value)}>
          <option value="">-- Select Partner's Place --</option>
          {partnerPlaces.map((place) => (
            <option key={place._id} value={place._id}>{place.name}</option>
          ))}
        </select>
      </div>

      <button className="trade-button mt-2" onClick={handleTrade} disabled={loading}>
        {loading ? 'Processing...' : tradeMode === 'direct' ? 'Execute Trade' : 'Send Trade Request'}
      </button>

      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
    </div>
  );
}
