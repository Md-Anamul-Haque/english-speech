import React, { useEffect, useState } from 'react';
import type { IWord } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

export function WordManager() {
    const [words, setWords] = useState<IWord[]>([]);
    const [newEnglish, setNewEnglish] = useState('');
    const [newBangla, setNewBangla] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const fetchWords = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/words');
            if (res.ok) setWords(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchWords();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/api/words', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ english: newEnglish, bangla: newBangla }),
            });
            setNewEnglish('');
            setNewBangla('');
            setIsOpen(false);
            fetchWords();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:3000/api/words/${id}`, { method: 'DELETE' });
            fetchWords();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Word Management</CardTitle>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Word</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Word</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="english">English</Label>
                                <Input
                                    id="english"
                                    value={newEnglish}
                                    onChange={(e) => setNewEnglish(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bangla">Bangla</Label>
                                <Input
                                    id="bangla"
                                    value={newBangla}
                                    onChange={(e) => setNewBangla(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Save Word</Button>
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
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {words.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                    No words found. Add some to get started!
                                </TableCell>
                            </TableRow>
                        ) : (
                            words.map((word) => (
                                <TableRow key={word._id}>
                                    <TableCell className="font-medium">{word.english}</TableCell>
                                    <TableCell>{word.bangla}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => word._id && handleDelete(word._id)}
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
