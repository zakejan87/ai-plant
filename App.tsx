
import React, { useState, useCallback } from 'react';
import { analyzeLeafImage } from './services/geminiService';
import { DiagnosisResult, DiagnosisStatus } from './types';
import { FileUploader } from './components/FileUploader';
import { ResultCard } from './components/ResultCard';
import { Spinner } from './components/Spinner';
import { GithubIcon, LeafIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = (file: File) => {
    handleReset();
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiagnosisResult(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeLeafImage(base64Image, imageFile.type);
      setDiagnosisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze the image. The AI model might be unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setDiagnosisResult(null);
    setIsLoading(false);
    setError(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
                <LeafIcon className="w-10 h-10 text-green-400"/>
                 <h1 className="text-4xl sm:text-5xl font-bold text-green-400 tracking-tight">
                    Plant AI
                 </h1>
            </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload a leaf image to get an instant AI-powered health diagnosis.
          </p>
        </header>

        <main className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              {imageUrl ? (
                <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <img src={imageUrl} alt="Uploaded Plant Leaf" className="w-full h-full object-cover" />
                </div>
              ) : (
                <FileUploader onFileUpload={handleImageUpload} />
              )}
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={!imageFile || isLoading}
                  className="flex-grow bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Leaf'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-xl min-h-[300px] border border-gray-700">
              {isLoading && <Spinner />}
              {error && <div className="text-center text-red-400"><p className="font-bold">An Error Occurred</p><p>{error}</p></div>}
              {diagnosisResult && <ResultCard result={diagnosisResult} />}
              {!isLoading && !error && !diagnosisResult && (
                <div className="text-center text-gray-500">
                  <LeafIcon className="w-16 h-16 mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">Awaiting Analysis</h3>
                  <p>Your plant's health report will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <a href="https://github.com/google/genai-js" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-green-400 transition-colors">
                <GithubIcon className="w-5 h-5" />
                Powered by Google Gemini
            </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
