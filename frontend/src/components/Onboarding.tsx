import React from 'react';

interface OnboardingProps {
  onSelectGameMode: (mode: 'player-vs-player' | 'player-vs-ai') => void;
  shouldDisable: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectGameMode, shouldDisable }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <svg id="icLogo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 147 28">
            <g fill="currentColor">
              <title>Internet Identity</title>
              <path d="M65.561 1.08v11.632h3.134V1.08H65.56Zm8.761 4.725 4.037 6.907h3.15V1.08h-3.051v6.316L74.832 1.08h-3.544v11.632h3.035V5.805ZM89.58 3.984v8.728h-3.084V3.984H83.15V1.08h9.795v2.904H89.58Zm5.004-2.904v11.632h7.482v-2.707h-4.43v-1.87h4.004v-2.56h-4.003V3.738h4.396V1.08h-7.449Zm9.664 11.632V1.08h4.905c2.362 0 3.904 1.575 3.904 3.74 0 1.576-.87 2.741-2.149 3.25l2.199 4.642h-3.331l-1.837-4.216h-.64v4.216h-3.051Zm4.331-6.579c.92 0 1.395-.525 1.395-1.263 0-.738-.475-1.246-1.395-1.246H107.3v2.51h1.279Zm9.516-.328 4.036 6.907h3.149V1.08h-3.051v6.316l-3.625-6.316h-3.545v11.632h3.036V5.805Zm9.779 6.907V1.08h7.448v2.658h-4.396v1.837h4.003v2.56h-4.003v1.87h4.429v2.707h-7.481Zm15.656 0V3.984h3.364V1.08h-9.795v2.904h3.347v8.728h3.084Z"></path>
              <path d="M65.524 27.49h3.145V15.812h-3.145V27.49Zm8.822-3.014h1.12c1.466 0 2.734-.857 2.734-2.833 0-1.977-1.268-2.866-2.734-2.866h-1.12v5.699Zm1.136 3.014h-4.216V15.812h4.233c3.393 0 5.863 2.224 5.863 5.847 0 3.624-2.47 5.83-5.88 5.83Zm7.863 0h7.51v-2.718H86.41v-1.878h4.019v-2.569h-4.02V18.48h4.415v-2.668h-7.478V27.49Zm19.96 0h-3.162l-4.052-6.934v6.934h-3.047V15.812h3.558l3.64 6.341v-6.34h3.063V27.49Zm8.108-8.763h3.376v-2.915h-9.832v2.915h3.36v8.763h3.096v-8.763Zm8.164 8.763h-3.146V15.812h3.146V27.49Zm8.098-8.763h3.376v-2.915h-9.833v2.915h3.36v8.763h3.097v-8.763Zm3.865-2.915 3.837 6.901v4.777h3.13v-4.777l3.87-6.9h-3.425l-1.927 3.952-1.928-3.953h-3.557Z"></path>
            </g>
            <g fill="#00ACE5">
              <path d="M48.691 23.265c-4.047 0-8.322-2.646-10.42-4.567-2.293-2.1-8.596-8.936-8.624-8.967C25.514 5.118 19.957 0 14.412 0 7.734 0 1.91 4.624.395 10.751c.117-.403 2.238-6.016 10.208-6.016 4.048 0 8.322 2.646 10.42 4.567 2.293 2.1 8.596 8.936 8.624 8.967 4.133 4.612 9.69 9.73 15.235 9.73 6.678 0 12.502-4.624 14.017-10.751-.117.403-2.238 6.016-10.208 6.016Z"></path>
              <path fill="url(#logo-loop-bottom)" d="M29.647 18.27c-.014-.017-1.83-1.985-3.864-4.132-1.1 1.305-2.685 3.084-4.507 4.68-3.395 2.977-5.602 3.6-6.864 3.6-4.762 0-8.646-3.776-8.646-8.418 0-4.642 3.88-8.39 8.646-8.419.173 0 .382.018.636.063-1.432-.55-2.953-.909-4.445-.909-7.967 0-10.09 5.61-10.207 6.015A13.507 13.507 0 0 0 .001 14c0 7.72 6.368 14 14.309 14 3.31 0 7.018-1.697 10.838-5.044 1.805-1.582 3.37-3.275 4.546-4.636a2.261 2.261 0 0 1-.045-.05l-.002.001Z"></path>
              <path fill="url(#logo-loop-top)" d="M29.647 9.73c.015.016 1.83 1.985 3.864 4.132 1.1-1.305 2.685-3.084 4.507-4.68 3.395-2.977 5.602-3.6 6.864-3.6 4.762 0 8.646 3.776 8.646 8.418 0 4.616-3.88 8.39-8.646 8.419a3.67 3.67 0 0 1-.636-.063c1.432.55 2.954.909 4.445.909 7.967 0 10.09-5.61 10.207-6.015.258-1.044.395-2.132.395-3.249C59.294 6.281 52.823 0 44.883 0c-3.311 0-6.916 1.698-10.735 5.044C32.342 6.626 30.776 8.32 29.6 9.68l.045.05h.001Z"></path>
            </g>
            <defs>
              <linearGradient id="logo-loop-bottom" x1="21.883" x2="2.381" y1="26.169" y2="5.974" gradientUnits="userSpaceOnUse">
                <stop offset=".22" stop-color="#FF0079"></stop>
                <stop offset=".89" stop-color="#592489"></stop>
              </linearGradient>
              <linearGradient id="logo-loop-top" x1="37.398" x2="56.9" y1="1.844" y2="22.039" gradientUnits="userSpaceOnUse">
                <stop offset=".21" stop-color="#FF4B00"></stop>
                <stop offset=".68" stop-color="#FFAB00"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Chess 23</h1>
        <div className="mb-4">
        </div>
        <button
          onClick={() => onSelectGameMode('player-vs-player')}
          disabled={shouldDisable}
          className={`w-full px-4 py-2 mb-4 ${shouldDisable ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-md transition-colors duration-300`}
        >
          Player vs Player
        </button>
        <button
          onClick={() => onSelectGameMode('player-vs-ai')}
          disabled={shouldDisable}
          className={`w-full px-4 py-2 ${shouldDisable ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            } text-white rounded-md transition-colors duration-300`}
        >
          Player vs AI
        </button>
        <p className="text-gray-600 mt-2">
          Already registered <a href="https://identity.ic0.app/#authorize" className="text-blue-500 hover:underline">but using a new device?</a>.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;