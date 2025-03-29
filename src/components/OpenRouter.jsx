import React, { useState, useEffect, useRef } from 'react';

const OpenRouterChat = () => {
  // IMPORTANT: Move API key to environment variable
  // Use process.env.REACT_APP_OPENROUTER_API_KEY in production
  // Never expose API keys in client-side code
  const API_KEY =
    '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';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedModel, setSelectedModel] = useState(
    'google/gemini-2.0-flash-exp:free'
  );
  const messagesEndRef = useRef(null);

  const models = [
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'openai/gpt-4', name: 'GPT-4' },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
    { id: 'mistralai/mistral-7b', name: 'Mistral 7B' },
    { id: 'google/gemini-pro', name: 'Gemini Pro' },
    {
      id: 'google/gemini-2.0-flash-lite-preview-02-05:free',
      name: 'Gemini 2.0',
    },
    {
      id: 'google/gemini-2.5-pro-exp-03-25:free',
      name: 'Gemini 2.5 Pro',
    },
  ];

  // Default story to tell when send is clicked with empty input
  const defaultStory =
    '# The Cosmic Explorer\n\nIn the year 2157, humanity had finally mastered interstellar travel. Captain Aria Zhang, commander of the explorer vessel \'Curiosity\', was about to embark on the most ambitious mission yet—a journey to the recently discovered exoplanet Kepler-186f.\n\n```\n// Ship\'s Log - Entry 1\ndate: 2157-03-15\ncoordinates: Sol System, Earth Orbit\nstatus: Pre-launch preparations complete\n```\n\n**Day 1**: The launch was flawless. As Earth faded into a pale blue dot behind us, the crew of twelve fell silent, each contemplating the three-year journey ahead.\n\n**Day 47**: We\'ve passed Mars and are approaching the asteroid belt. The ship\'s AI, ASTRA, has plotted a course through the debris with 99.8% safety margin.\n\n**Day 365**: One year in deep space. The team celebrated with synthesized cake. Dr. Patel discovered an unusual quantum fluctuation in sector 7. Worth investigating tomorrow.\n\n**Day 366**: The quantum fluctuation wasn\'t a glitch. We\'ve discovered what appears to be a wormhole—stable and seemingly traversable. This changes everything.\n\n*To be continued...*';

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If input is empty, send the default story
    if (!input.trim()) {
      const assistantMessage = { role: 'assistant', content: defaultStory };
      setMessages((prev) => [...prev, assistantMessage]);
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    const conversationHistory = [...messages, userMessage];

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'React Chat App',
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: conversationHistory.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || response.statusText || 'Unknown error'
        );
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      // Process the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Parse the SSE format (data: {...}\n\n)
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const jsonData = JSON.parse(line.substring(6));
              // Extract the delta content from the streaming response
              const content = jsonData.choices?.[0]?.delta?.content || '';
              if (content) {
                responseText += content;
                setStreamingContent(responseText);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      // When stream is complete, add the complete message
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: responseText },
      ]);
      setStreamingContent('');
    } catch (error) {
      console.error('Error with API request:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Error: ${error.message || 'Failed to communicate with API'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion button clicks
  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  // Parse and render message content with markdown-like formatting
  const renderMessageContent = (content) => {
    // Split by code blocks first
    const segments = content.split(/(```[\s\S]*?```)/);

    return segments.map((segment, segIndex) => {
      // Handle code blocks
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const codeContent = segment.slice(3, -3).trim();
        let language = '';
        let code = codeContent;

        // Check if there's a language specified
        const firstLineEnd = codeContent.indexOf('\n');
        if (firstLineEnd > 0) {
          const possibleLang = codeContent.substring(0, firstLineEnd).trim();
          if (possibleLang && !possibleLang.includes(' ')) {
            language = possibleLang;
            code = codeContent.substring(firstLineEnd + 1);
          }
        }

        return (
          <div
            key={segIndex}
            className="my-4 rounded-lg overflow-hidden bg-gray-900 border border-gray-700 shadow-md"
          >
            {language && (
              <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono border-b border-gray-700 flex justify-between items-center">
                <span>{language}</span>
                <span className="text-gray-500 text-xs">code block</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto">
              <code className="text-gray-300 font-mono text-sm">{code}</code>
            </pre>
          </div>
        );
      }

      // Handle regular text with line breaks and basic formatting
      const processedText = segment.split('\n').map((line, lineIndex) => {
        // Bold text processing
        const boldTextProcessed = line.replace(
          /\*\*(.*?)\*\*/g,
          (_, text) => `<strong>${text}</strong>`
        );

        // Italic text processing
        const italicTextProcessed = boldTextProcessed.replace(
          /\*(.*?)\*/g,
          (_, text) => `<em>${text}</em>`
        );

        // Simple header detection
        if (line.startsWith('# ')) {
          return (
            <h1
              key={lineIndex}
              className="text-xl font-bold mt-4 mb-2 text-purple-300"
              dangerouslySetInnerHTML={{
                __html: italicTextProcessed.substring(2),
              }}
            />
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2
              key={lineIndex}
              className="text-lg font-bold mt-3 mb-2 text-blue-300"
              dangerouslySetInnerHTML={{
                __html: italicTextProcessed.substring(3),
              }}
            />
          );
        }

        // Regular paragraph
        return (
          <React.Fragment key={lineIndex}>
            <span
              dangerouslySetInnerHTML={{ __html: italicTextProcessed }}
            />
            {lineIndex < segment.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      });

      return <div key={segIndex} className="message-text">{processedText}</div>;
    });
  };

  // Get model icon and color based on provider
  const getModelDetails = (modelId) => {
    if (modelId.startsWith('openai')) {
      return {
        icon: '🔵',
        color: 'from-green-900 to-green-800',
        border: 'border-green-700',
        accent: 'bg-green-400',
      };
    }
    if (modelId.startsWith('anthropic')) {
      return {
        icon: '🟣',
        color: 'from-purple-900 to-purple-800',
        border: 'border-purple-700',
        accent: 'bg-purple-400',
      };
    }
    if (modelId.startsWith('google')) {
      return {
        icon: '🟢',
        color: 'from-blue-900 to-blue-800',
        border: 'border-blue-700',
        accent: 'bg-blue-400',
      };
    }
    if (modelId.startsWith('mistralai')) {
      return {
        icon: '🔴',
        color: 'from-red-900 to-red-800',
        border: 'border-red-700',
        accent: 'bg-red-400',
      };
    }
    return {
      icon: '🤖',
      color: 'from-gray-800 to-gray-700',
      border: 'border-gray-700',
      accent: 'bg-gray-400',
    };
  };

  const currentModelDetails = getModelDetails(selectedModel);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white p-4 shadow-lg border-b border-gray-700">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center">
            <span className="text-3xl mr-2">✨</span>
            <span>PK CHAT</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm bg-black/30 px-3 py-1 rounded-full flex items-center border border-gray-700">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Powered by OpenRouter
            </span>
          </div>
        </div>
      </header>

      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <div className="flex-1 max-w-full md:max-w-xs">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select AI Model
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full appearance-none bg-gray-700 border border-gray-600 rounded-lg py-2 pl-3 pr-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm text-white"
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {getModelDetails(model.id).icon} {model.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 text-right mt-2 md:mt-0">
              <div className="inline-flex items-center justify-center bg-purple-900 text-purple-200 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-700">
                <span className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                  Dark Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden container mx-auto p-4">
        <div className="h-full bg-gray-800 rounded-xl shadow-xl overflow-y-auto p-6 flex flex-col gap-6 border border-gray-700">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
              <div className="w-16 h-16 mb-4 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full flex items-center justify-center shadow-lg border border-gray-700">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-200 mb-2">
                Welcome to PK Chat
              </h3>
              <p className="max-w-md text-gray-400">
                Start a conversation with your selected AI model or click one of
                the suggestions below.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                <button
                  className="px-4 py-2 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors border border-gray-600"
                  onClick={() =>
                    handleSuggestion(
                      'Tell me an epic sci-fi story about space exploration'
                    )
                  }
                >
                  <span className="block font-medium text-gray-200">
                    Tell me a story
                  </span>
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors border border-gray-600"
                  onClick={() =>
                    handleSuggestion('Explain quantum physics in simple terms')
                  }
                >
                  <span className="block font-medium text-gray-200">
                    Explain quantum physics
                  </span>
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors border border-gray-600"
                  onClick={() =>
                    handleSuggestion('Write a Python script to analyze CSV data')
                  }
                >
                  <span className="block font-medium text-gray-200">
                    Write Python code
                  </span>
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors border border-gray-600"
                  onClick={() =>
                    handleSuggestion('Help me plan a 7-day trip to Japan')
                  }
                >
                  <span className="block font-medium text-gray-200">
                    Plan my trip
                  </span>
                </button>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                ✨ Pro tip: Click send with an empty message to see a story
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-4 rounded-2xl max-w-3/4 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-800 to-purple-800 text-white border border-indigo-700'
                    : message.role === 'system'
                      ? 'bg-gradient-to-r from-red-900 to-red-800 border border-red-700 text-gray-200'
                      : `bg-gradient-to-r ${currentModelDetails.color} border ${currentModelDetails.border}`
                }`}
              >
                <div className="font-bold text-sm mb-2 flex items-center gap-1">
                  {message.role === 'user'
                    ? '👤 You'
                    : message.role === 'system'
                      ? '⚠️ System'
                      : `${currentModelDetails.icon} ${
                        models.find((m) => m.id === selectedModel)?.name || 'AI'
                      }`}
                </div>
                <div className="message-content">
                  {renderMessageContent(message.content)}
                </div>
                <div className="text-xs mt-2 opacity-70 text-right">
                  {new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Show streaming content when loading */}
          {isLoading && streamingContent && (
            <div className="flex justify-start">
              <div
                className={`p-4 rounded-2xl max-w-3/4 shadow-lg bg-gradient-to-r ${currentModelDetails.color} border ${currentModelDetails.border}`}
              >
                <div className="font-bold text-sm mb-2 flex items-center gap-1">
                  {currentModelDetails.icon}{' '}
                  {models.find((m) => m.id === selectedModel)?.name || 'AI'}
                </div>
                <div className="message-content">
                  {renderMessageContent(streamingContent)}
                </div>
                <div className="text-xs mt-2 opacity-70 text-right">
                  {new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Show loading indicators when no content is streaming yet */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div
                className={`p-4 rounded-2xl max-w-3/4 shadow-lg bg-gradient-to-r ${currentModelDetails.color} border ${currentModelDetails.border}`}
              >
                <div className="font-bold text-sm mb-2 flex items-center gap-1">
                  {currentModelDetails.icon}{' '}
                  {models.find((m) => m.id === selectedModel)?.name || 'AI'}
                </div>
                <div className="flex gap-2 py-2">
                  <div
                    className={`w-2 h-2 ${currentModelDetails.accent} rounded-full animate-bounce`}
                  ></div>
                  <div
                    className={`w-2 h-2 ${currentModelDetails.accent} rounded-full animate-bounce`}
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className={`w-2 h-2 ${currentModelDetails.accent} rounded-full animate-bounce`}
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-gray-800 border-t border-gray-700 shadow-lg">
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message or send empty for a story..."
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-lg text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-lg hover:from-purple-800 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-purple-600"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Send
                </span>
              )}
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-gray-500">
            PK Chat uses OpenRouter to access multiple AI models • Send an
            empty message to get a story
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenRouterChat;