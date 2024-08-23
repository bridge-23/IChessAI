import React, { useState, useEffect } from "react";
import { chess23 } from "declarations/chess23";
import { ApiError, InferenceRecord, InferenceRecordResult, StatusCodeRecord } from "declarations/chess23/chess23.did";

const ChessDashboard = () => {
  const [healthResult, setHealthResult] = useState<{ Ok: StatusCodeRecord } | { Err: ApiError } | string>("");
  const [inferenceResult, setInferenceResult] = useState<{ Ok: InferenceRecord } | { Err: ApiError } | string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  const data = { prompt: "rnbqkbr1/pppppppp/7n/6N1/8/8/PPPPPPPP/RNBQKB1R w" }

  useEffect(() => {
    callHealth();
  }, []);

  const handleInference = () => {
    callInference();
  };

  async function callHealth() {
    await chess23.health().then((health) => {
      console.log(health)
      setHealthResult(health)
    })
  }

  async function callInference() {
    await chess23.inference_chess(data).then((response) => {
      console.log('inference', response)
      setInferenceResult(response)
    });
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-20">Chess Dashboard</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Health Check</h3>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Chess Inference</h3>
        <button
          onClick={handleInference}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Call Inference
        </button>

      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Debug Information</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {debugInfo}
        </pre>
      </div>
    </div>
  );
};

export default ChessDashboard;