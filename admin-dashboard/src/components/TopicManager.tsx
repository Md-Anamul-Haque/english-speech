import React, { useEffect, useState } from 'react';
import type { ITopic, IWord, ISentence } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, LayoutGrid, BookOpen, Layers } from 'lucide-react';

export function TopicManager() {
    const [topics, setTopics] = useState<ITopic[]>([]);
    const [words, setWords] = useState<IWord[]>([]);
    const [sentences, setSentences] = useState<ISentence[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        level: 1,
        slug: '',
        description: '',
        selectedWords: [] as string[],
        selectedSentences: [] as string[]
    });

    const fetchData = async () => {
        try {
            const [topicsRes, wordsRes, sentencesRes] = await Promise.all([
                fetch('/api/topics'),
                fetch('/api/words'),
                fetch('/api/sentences')
            ]);

            if (topicsRes.ok) setTopics(await topicsRes.json());
            if (wordsRes.ok) setWords(await wordsRes.json());
            if (sentencesRes.ok) setSentences(await sentencesRes.json());
        } catch (e) {
            console.error('Failed to fetch data', e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    level: formData.level,
                    slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
                    description: formData.description,
                    words: formData.selectedWords,
                    sentences: formData.selectedSentences
                }),
            });

            if (res.ok) {
                setIsOpen(false);
                setFormData({
                    title: '',
                    level: topics.length + 1,
                    slug: '',
                    description: '',
                    selectedWords: [],
                    selectedSentences: []
                });
                fetchData();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this topic?')) return;
        try {
            await fetch(`/api/topics/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleSelection = (id: string, type: 'words' | 'sentences') => {
        setFormData(prev => {
            const field = type === 'words' ? 'selectedWords' : 'selectedSentences';
            const current = prev[field];
            const next = current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id];
            return { ...prev, [field]: next };
        });
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" /> Topic & Level Management
                    </CardTitle>
                    <CardDescription>Organize words and sentences into progressive learning levels.</CardDescription>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Create Topic</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Learning Topic</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddTopic} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="topic-title">Title</Label>
                                    <Input
                                        id="topic-title"
                                        placeholder="e.g. Daily Conversation"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="topic-level">Level</Label>
                                    <Input
                                        id="topic-level"
                                        type="number"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="topic-description">Description</Label>
                                <Input
                                    id="topic-description"
                                    placeholder="What will students learn in this topic?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Select Words ({formData.selectedWords.length})
                                    </Label>
                                    <div className="border rounded-md p-2 h-48 overflow-y-auto space-y-1">
                                        {words.map(word => (
                                            <div
                                                key={word._id}
                                                onClick={() => word._id && toggleSelection(word._id, 'words')}
                                                className={`text-sm p-2 rounded cursor-pointer border ${formData.selectedWords.includes(word._id!)
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'hover:bg-muted'
                                                    }`}
                                            >
                                                {word.english} - {word.bangla}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <LayoutGrid className="h-4 w-4" /> Select Sentences ({formData.selectedSentences.length})
                                    </Label>
                                    <div className="border rounded-md p-2 h-48 overflow-y-auto space-y-1">
                                        {sentences.map(sentence => (
                                            <div
                                                key={sentence._id}
                                                onClick={() => sentence._id && toggleSelection(sentence._id, 'sentences')}
                                                className={`text-sm p-2 rounded cursor-pointer border ${formData.selectedSentences.includes(sentence._id!)
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'hover:bg-muted'
                                                    }`}
                                            >
                                                {sentence.english}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Creating...' : 'Finalize Topic'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Level</TableHead>
                            <TableHead>Topic Title</TableHead>
                            <TableHead>Stats</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No topics defined.
                                </TableCell>
                            </TableRow>
                        ) : (
                            topics.map((topic) => (
                                <TableRow key={topic._id}>
                                    <TableCell className="font-bold">Lvl {topic.level}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{topic.title}</div>
                                        <div className="text-xs text-muted-foreground">{topic.description}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            {Array.isArray(topic.words) ? topic.words.length : 0} words, {Array.isArray(topic.sentences) ? topic.sentences.length : 0} sentences
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => topic._id && handleDelete(topic._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
