import React, { useState, useEffect } from "react";
import { useQueryCall } from "service/hello";
import { chess23 } from "declarations/chess23";

// Define the types based on the provided information
type ApiError = {
  InvalidId: null;
  ZeroAddress: null;
  StatusCode: number;
  Other: string;
};

interface InferenceRecord {
  inference: string;
}

type InferenceRecordResult = 
  { Ok: InferenceRecord } |
  { Err: ApiError };

const ChessDashboard = () => {
  const [healthResult, setHealthResult] = useState<string>("");
  const [inferenceResult, setInferenceResult] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");



  const { call: callHealth, data: healthData, error: healthError, loading: healthLoading } = useQueryCall({
    refetchOnMount: false,
    functionName: "health"
  });


  const { call: callInference, data: inferenceData, error: inferenceError, loading: inferenceLoading } = useQueryCall({
    refetchOnMount: false,
    functionName: "inference",
    args: [{
      temperature: 0.7,
      topp: 0.9,
      steps: BigInt(50),
      rng_seed: BigInt(12345),
      prompt: "rnbqkbr1/pppppppp/7n/6N1/8/8/PPPPPPPP/RNBQKB1R w"
    }]
  });

  useEffect(() => {
    callHealth();
  }, []);

  useEffect(() => {
    if (healthData) {
      setHealthResult(`Health Data: ${JSON.stringify(healthData)}`);
      setDebugInfo(prev => `${prev}\nHealth Data Type: ${typeof healthData}`);
      logBytes(healthData, 'Health Data');
    }
  }, [healthData]);

  useEffect(() => {
    if (inferenceData) {
      handleInferenceResult;
    }
  }, [inferenceData]);

  const handleInference = () => {
    callInference();
  };

  const handleInferenceResult = (result: InferenceRecordResult) => {
    if ('Ok' in result) {
      setInferenceResult(`Inference Data: ${JSON.stringify(result.Ok)}`);
      setDebugInfo(prev => `${prev}\nInference Data Type: InferenceRecord`);
      logBytes(result.Ok, 'Inference Data');
    } else if ('Err' in result) {
      setInferenceResult(`Inference Error: ${JSON.stringify(result.Err)}`);
      setDebugInfo(prev => `${prev}\nInference Error Type: ApiError`);
      logBytes(result.Err, 'Inference Error');
    }
  };

  const logBytes = (data: any, label: string) => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(JSON.stringify(data));
    console.log(`${label} (bytes):`, bytes);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chess Dashboard</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Health Check</h3>
        {healthLoading && <p className="text-gray-600">Checking health...</p>}
        {healthError && <p className="text-red-500">Error: {JSON.stringify(healthError)}</p>}
        {healthResult && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {healthResult}
          </pre>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Chess Inference</h3>
        <button
          onClick={handleInference}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Call Inference
        </button>
        {inferenceLoading && <p className="text-gray-600">Loading inference...</p>}
        {inferenceError && (
          <div className="text-red-500">
            <p>Unexpected Error: {JSON.stringify(inferenceError)}</p>
          </div>
        )}
        {inferenceResult && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {inferenceResult}
          </pre>
        )}
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