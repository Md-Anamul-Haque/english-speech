import { WordManager } from "./components/WordManager"
import { SentenceManager } from "./components/SentenceManager"
import { TopicManager } from "./components/TopicManager"

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">English Speech Admin</h1>
        <div className="text-sm text-gray-500">Connected to local DB</div>
      </header>

      <main className="w-full max-w-6xl px-4 flex flex-col gap-12 pb-12">
        <section>
          <TopicManager />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <div className="mb-4 text-center border-b pb-4">
              <h2 className="text-xl font-bold tracking-tight">Vocabulary Bank</h2>
              <p className="text-sm text-muted-foreground">Manage the global database of words.</p>
            </div>
            <WordManager />
          </section>

          <section>
            <div className="mb-4 text-center border-b pb-4">
              <h2 className="text-xl font-bold tracking-tight">Sentence Bank</h2>
              <p className="text-sm text-muted-foreground">Manage the global database of sentences.</p>
            </div>
            <SentenceManager />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
