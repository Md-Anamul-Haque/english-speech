import React, { useEffect, useState } from 'react';
import type { ISentence } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

export function SentenceManager() {
    const [sentences, setSentences] = useState<ISentence[]>([]);
    const [english, setEnglish] = useState('');
    const [bangla, setBangla] = useState('');
    const [context, setContext] = useState('');
    const [contextColor, setContextColor] = useState('#3B82F6');
    const [feedback, setFeedback] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const fetchSentences = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/sentences');
            if (res.ok) setSentences(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchSentences();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/api/sentences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english,
                    bangla,
                    context,
                    contextColor,
                    feedback: feedback || null,
                }),
            });
            setEnglish('');
            setBangla('');
            setContext('');
            setContextColor('#3B82F6');
            setFeedback('');
            setIsOpen(false);
            fetchSentences();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:3000/api/sentences/${id}`, { method: 'DELETE' });
            fetchSentences();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sentence Management</CardTitle>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Sentence</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Sentence</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="english-s">English</Label>
                                <Input id="english-s" value={english} onChange={(e) => setEnglish(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bangla-s">Bangla</Label>
                                <Input id="bangla-s" value={bangla} onChange={(e) => setBangla(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="context">Context (e.g. Formal, Casual)</Label>
                                <Input id="context" value={context} onChange={(e) => setContext(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Context Color (Hex Code)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        id="color-picker"
                                        value={contextColor}
                                        onChange={(e) => setContextColor(e.target.value)}
                                        className="w-[60px] p-1 h-10 cursor-pointer"
                                    />
                                    <Input id="color" value={contextColor} onChange={(e) => setContextColor(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="feedback">Default Feedback (Optional)</Label>
                                <Input id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="e.g. Pronunciation correct" />
                            </div>
                            <Button type="submit" className="w-full">Save Sentence</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>English</TableHead>
                            <TableHead>Bangla</TableHead>
                            <TableHead>Context</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sentences.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                    No sentences found. Add some to get started!
                                </TableCell>
                            </TableRow>
                        ) : (
                            sentences.map((sentence) => (
                                <TableRow key={sentence._id}>
                                    <TableCell className="font-medium">{sentence.english}</TableCell>
                                    <TableCell>{sentence.bangla}</TableCell>
                                    <TableCell>
                                        <div
                                            className="px-2 py-1 rounded-md text-white text-xs inline-block"
                                            style={{ backgroundColor: sentence.contextColor }}
                                        >
                                            {sentence.context}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => sentence._id && handleDelete(sentence._id)}
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
