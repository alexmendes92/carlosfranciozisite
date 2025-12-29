import React, { useState, useEffect } from 'react';
import { 
  Zap,
  RefreshCw,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  LayoutDashboard,
  PlusCircle,
  AlignLeft,
  FolderOpen,
  Settings,
  Circle,
  Edit3,
  Eye,
  Menu,
  X,
  History,
  Calendar
} from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PostWizard from './components/PostWizard';
import ArticleWizard from './components/ArticleWizard';
import InfographicWizard from './components/InfographicWizard';
import ConversionWizard from './components/ConversionWizard';
import AppointmentScheduler from './components/AppointmentScheduler'; // New
import PostPreview from './components/PostPreview';
import ArticlePreview from './components/ArticlePreview';
import InfographicPreview from './components/InfographicPreview';
import ConversionPreview from './components/ConversionPreview';
import MaterialsLibrary from './components/MaterialsLibrary';
import { generatePostImage, generatePostText, generateSEOArticle, generateInfographicContent, generateConversionContent } from './services/geminiService';
import { GeneratedResult, PostState, GeneratedArticle, ArticleState, InfographicState, InfographicResult, ConversionState, ConversionResult, PostFormat } from './types';

type ViewMode = 'dashboard' | 'post' | 'seo' | 'materials' | 'infographic' | 'conversion' | 'appointments';
type MobileTab = 'editor' | 'preview';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');
  
  // Post State
  const [postResult, setPostResult] = useState<GeneratedResult | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postLastState, setPostLastState] = useState<PostState | null>(null);
  const [regenTextLoading, setRegenTextLoading] = useState(false);
  const [regenImageLoading, setRegenImageLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Persistence Logic (Load on Mount)
  useEffect(() => {
    const savedPost = localStorage.getItem('medisocial_last_post');
    if (savedPost) {
        try {
            setPostResult(JSON.parse(savedPost));
        } catch (e) {
            console.error("Failed to load draft", e);
        }
    }
  }, []);

  // Persistence Logic (Save on Change)
  useEffect(() => {
    if (postResult) {
        localStorage.setItem('medisocial_last_post', JSON.stringify(postResult));
    }
  }, [postResult]);

  // Other Tools State
  const [articleResult, setArticleResult] = useState<GeneratedArticle | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [infographicResult, setInfographicResult] = useState<InfographicResult | null>(null);
  const [infographicLoading, setInfographicLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMobileTab('editor');
  }, [viewMode]);

  // Handlers
  const handleGeneratePost = async (state: PostState) => {
    setPostLoading(true);
    setError(null);
    setPostResult(null);
    setPostLastState(state);

    try {
      // Parallel execution for Text and Image (if no custom image uploaded)
      // If custom image is uploaded, we generate text first using Vision, then skip image gen
      
      const content = await generatePostText(state);
      
      let imageUrl = null;
      let isCustomImage = false;

      if (state.uploadedImage) {
          imageUrl = state.uploadedImage;
          isCustomImage = true;
      } else {
          // Generate AI Image
          imageUrl = await generatePostImage(content.imagePromptDescription, state.format);
      }

      const newResult = { 
          id: Date.now().toString(),
          date: new Date().toISOString(),
          content, 
          imageUrl, 
          isCustomImage 
      };

      setPostResult(newResult);
      setMobileTab('preview'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar o post.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleRegeneratePostText = async () => {
    if (!postLastState || !postResult) return;
    setRegenTextLoading(true);
    try {
      const newContent = await generatePostText(postLastState);
      setPostResult({ ...postResult, content: newContent });
    } catch (err: any) {
        setError("Falha ao regerar o texto");
    } finally {
      setRegenTextLoading(false);
    }
  };

  const handleRegeneratePostImage = async () => {
    if (!postResult?.content?.imagePromptDescription || postResult.isCustomImage) return;
    setRegenImageLoading(true);
    try {
      const newImageUrl = await generatePostImage(postResult.content.imagePromptDescription, postLastState?.format || PostFormat.FEED);
      setPostResult({ ...postResult, imageUrl: newImageUrl });
    } catch (err: any) {
        setError("Falha ao regerar a imagem");
    } finally {
        setRegenImageLoading(false);
    }
  };

  const handleGenerateArticle = async (state: ArticleState) => {
    setArticleLoading(true);
    setError(null);
    setArticleResult(null);
    try {
        const article = await generateSEOArticle(state);
        setArticleResult(article);
        setMobileTab('preview');
    } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao gerar o artigo.");
    } finally {
        setArticleLoading(false);
    }
  }

  const handleGenerateInfographic = async (state: InfographicState) => {
    setInfographicLoading(true);
    setError(null);
    setInfographicResult(null);
    try {
        const data = await generateInfographicContent(state);
        setInfographicResult({ data }); 
        setMobileTab('preview');

        // Async load images for infographic
        const heroPromise = data.heroImagePrompt 
            ? generatePostImage(data.heroImagePrompt, PostFormat.FEED)
            : Promise.resolve(null);
        const anatomyPromise = data.anatomy?.imagePrompt 
            ? generatePostImage(data.anatomy.imagePrompt, PostFormat.FEED) // Use 1:1 for anatomy
            : Promise.resolve(null);

        heroPromise.then(url => setInfographicResult(prev => prev ? { ...prev, heroImageUrl: url } : null));
        anatomyPromise.then(url => setInfographicResult(prev => prev ? { ...prev, anatomyImageUrl: url } : null));

    } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao gerar o infográfico.");
    } finally {
        setInfographicLoading(false);
    }
  }

  const handleGenerateConversion = async (state: ConversionState) => {
      setConversionLoading(true);
      setError(null);
      setConversionResult(null);
      try {
          const result = await generateConversionContent(state);
          setConversionResult(result);
          setMobileTab('preview');
      } catch (err: any) {
          setError(err.message || "Erro ao gerar estratégia.");
      } finally {
          setConversionLoading(false);
      }
  };

  const handleDownloadImage = () => {
    if (!postResult?.imageUrl) return;
    const link = document.createElement('a');
    link.href = postResult.imageUrl;
    link.download = `post-medisocial-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    if (!postResult?.content) return;
    // Copy currently viewed/edited text would be ideal, but for now copy generated state
    const text = `${postResult.content.headline}\n\n${postResult.content.caption}\n\n${postResult.content.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPageInfo = () => {
    switch (viewMode) {
      case 'post': return { title: 'INSTAGRAM AI', subtitle: 'Feed & Stories' };
      case 'seo': return { title: 'BLOG & SEO', subtitle: 'Redator Médico' };
      case 'infographic': return { title: 'VISUAL AID', subtitle: 'Infográfico Clínico' };
      case 'materials': return { title: 'BIBLIOTECA', subtitle: 'Materiais Educativos' };
      case 'conversion': return { title: 'ESTRATÉGIA', subtitle: 'Quebra de Objeções' };
      case 'appointments': return { title: 'AGENDA', subtitle: 'Smart Recall' }; // New
      default: return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo();
  const hasResult = postResult || articleResult || infographicResult || conversionResult;
  const isGenerating = postLoading || articleLoading || infographicLoading || conversionLoading;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Agendamentos' }, // New
    { id: 'post', icon: PlusCircle, label: 'Post Instagram' },
    { id: 'seo', icon: AlignLeft, label: 'Artigo SEO' },
    { id: 'materials', icon: FolderOpen, label: 'Materiais' },
  ];

  return (
    <div className="flex h-screen bg-app-bg text-slate-800 overflow-hidden font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[260px] bg-sidebar text-white flex-col flex-shrink-0 z-20 shadow-xl">
        <div className="h-24 flex items-center px-6 border-b border-white/10">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-3 shadow-glow">
                <span className="font-serif font-bold text-lg text-sidebar">SJ</span>
            </div>
            <div>
                <span className="font-bold text-white text-base tracking-wide block">SEU JOELHO</span>
                <span className="text-[10px] text-accent uppercase tracking-widest">Dr. Carlos Franciozi</span>
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
            {menuItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => { setViewMode(item.id as ViewMode); setPostResult(null); setArticleResult(null); setInfographicResult(null); setConversionResult(null); }}
                    className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all text-sm font-medium
                    ${viewMode === item.id 
                        ? 'bg-accent text-white shadow-lg font-bold transform scale-[1.02]' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          <Header 
            onBack={() => {
                setViewMode('dashboard');
                // Don't clear result on back to allow resuming draft
            }} 
            showBack={viewMode !== 'dashboard'}
            title={title}
            subtitle={subtitle}
          />

          <main className="flex-1 overflow-hidden relative flex flex-col lg:flex-row">
              
              {/* DASHBOARD, MATERIALS & APPOINTMENTS (Full Width) */}
              {(viewMode === 'dashboard' || viewMode === 'materials' || viewMode === 'appointments') && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar pb-20 lg:pb-0 bg-app-bg">
                      {viewMode === 'dashboard' && <Dashboard onSelectTool={(tool) => setViewMode(tool as ViewMode)} />}
                      {viewMode === 'materials' && <div className="p-4 lg:p-12 max-w-7xl mx-auto"><MaterialsLibrary /></div>}
                      {viewMode === 'appointments' && <div className="p-0 lg:p-12 max-w-7xl mx-auto h-full"><AppointmentScheduler /></div>}
                  </div>
              )}

              {/* TOOLS SPLIT VIEW (Post, SEO, etc) */}
              {viewMode !== 'dashboard' && viewMode !== 'materials' && viewMode !== 'appointments' && (
                  <>
                    {/* MOBILE TAB CONTROLS (Floating at Bottom above Nav) */}
                    {(hasResult || isGenerating) && (
                        <div className="lg:hidden fixed bottom-20 left-4 right-4 bg-white rounded-full shadow-float border border-slate-200 z-40 p-1 flex">
                            <button 
                                onClick={() => setMobileTab('editor')}
                                className={`flex-1 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all
                                ${mobileTab === 'editor' ? 'bg-sidebar text-white shadow-md' : 'text-slate-500'}`}
                            >
                                <Edit3 className="w-3 h-3" /> Editar
                            </button>
                            <button 
                                onClick={() => setMobileTab('preview')}
                                className={`flex-1 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all
                                ${mobileTab === 'preview' ? 'bg-sidebar text-white shadow-md' : 'text-slate-500'}`}
                            >
                                <Eye className="w-3 h-3" /> Resultado
                            </button>
                        </div>
                    )}

                    {/* EDITOR PANEL */}
                    <div className={`
                        flex-1 lg:w-[450px] xl:w-[500px] lg:flex-none bg-white lg:border-r border-slate-200 overflow-y-auto z-10 no-scrollbar pb-32 lg:pb-0
                        ${(hasResult || isGenerating) && mobileTab === 'preview' ? 'hidden lg:block' : 'block'}
                    `}>
                        <div className="p-6 lg:p-8">
                            {error && (
                                <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-3 text-sm animate-fadeIn">
                                    <Zap className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {viewMode === 'post' && <PostWizard onGenerate={handleGeneratePost} isGenerating={postLoading} />}
                            {viewMode === 'seo' && <ArticleWizard onGenerate={handleGenerateArticle} isGenerating={articleLoading} />}
                            {viewMode === 'infographic' && <InfographicWizard onGenerate={handleGenerateInfographic} isGenerating={infographicLoading} />}
                            {viewMode === 'conversion' && <ConversionWizard onGenerate={handleGenerateConversion} isGenerating={conversionLoading} />}
                        </div>
                    </div>

                    {/* PREVIEW PANEL */}
                    <div className={`
                        flex-1 bg-app-bg overflow-hidden relative flex flex-col
                        ${(hasResult || isGenerating) && mobileTab === 'preview' ? 'block' : 'hidden lg:flex'}
                    `}>
                        <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar pb-32 lg:pb-0">
                            
                            {!hasResult && !isGenerating && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60 p-8 text-center">
                                    <div className="w-20 h-20 bg-slate-200 rounded-3xl mb-6 hidden lg:flex items-center justify-center">
                                        <LayoutDashboard className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="font-bold text-lg text-slate-400 hidden lg:block">Comece sua criação</p>
                                    <p className="text-sm hidden lg:block">Preencha os dados ao lado.</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="h-full flex flex-col items-center justify-center p-8">
                                    <div className="relative w-24 h-24 mb-8">
                                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap className="w-8 h-8 text-accent animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-sidebar uppercase tracking-widest animate-pulse">Inteligência Artificial Trabalhando...</p>
                                </div>
                            )}

                            {viewMode === 'post' && postResult && (
                                <div className="py-8 lg:py-12 px-4 flex justify-center bg-slate-100 min-h-full">
                                    <PostPreview 
                                        result={postResult}
                                        onRegenerateText={handleRegeneratePostText}
                                        onRegenerateImage={handleRegeneratePostImage}
                                        isRegenerating={regenTextLoading || regenImageLoading}
                                    />
                                </div>
                            )}

                            {viewMode === 'seo' && articleResult && <div className="p-4 lg:p-12 max-w-4xl mx-auto"><ArticlePreview article={articleResult} /></div>}
                            {viewMode === 'infographic' && infographicResult && <div className="w-full h-full min-h-screen lg:min-h-0 bg-white"><InfographicPreview data={infographicResult.data} heroImageUrl={infographicResult.heroImageUrl} anatomyImageUrl={infographicResult.anatomyImageUrl} onBack={() => setInfographicResult(null)} /></div>}
                            {viewMode === 'conversion' && conversionResult && <div className="p-4 lg:p-12 max-w-4xl mx-auto"><ConversionPreview result={conversionResult} /></div>}
                        </div>

                        {/* DESKTOP FOOTER ACTIONS (POST) */}
                        {viewMode === 'post' && postResult && (
                            <div className="bg-white border-t border-slate-200 p-4 px-8 hidden lg:flex items-center justify-between shadow-lg z-20">
                                <div className="flex gap-3">
                                    <button onClick={handleRegeneratePostImage} disabled={regenImageLoading || postResult.isCustomImage} className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 uppercase tracking-wide disabled:opacity-50">
                                        <ImageIcon className="w-4 h-4 mr-2" /> {postResult.isCustomImage ? 'Imagem Custom' : 'Nova Imagem'}
                                    </button>
                                    <button onClick={handleRegeneratePostText} disabled={regenTextLoading} className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 uppercase tracking-wide disabled:opacity-50">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Reescrever
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                     <button onClick={handleCopyText} className="flex items-center px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors">
                                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? "Copiado!" : "Copiar"}
                                    </button>
                                    <button onClick={handleDownloadImage} disabled={!postResult.imageUrl} className="flex items-center px-6 py-2 bg-sidebar text-white hover:bg-sidebar-hover rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                                        <Download className="w-4 h-4 mr-2" /> Baixar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                  </>
              )}

          </main>

          {/* MOBILE NAV BAR */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex justify-around items-center z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <button 
                  onClick={() => { setViewMode('dashboard'); setPostResult(null); }}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1
                  ${viewMode === 'dashboard' ? 'text-sidebar' : 'text-slate-400'}`}
              >
                  <LayoutDashboard className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Início</span>
              </button>
              
              <div className="relative -top-5">
                  <button 
                    onClick={() => setViewMode('post')}
                    className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white shadow-float border-4 border-app-bg transform transition-transform active:scale-90"
                  >
                    <PlusCircle className="w-8 h-8" />
                  </button>
              </div>

              <button 
                  onClick={() => setViewMode('appointments')}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1
                  ${viewMode === 'appointments' ? 'text-sidebar' : 'text-slate-400'}`}
              >
                  <Calendar className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Agenda</span>
              </button>
          </nav>

      </div>
    </div>
  );
}

export default App;