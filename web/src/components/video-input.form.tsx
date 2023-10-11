import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { FileVideo } from "lucide-react";
import { UploadIcon } from "@radix-ui/react-icons";
import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "@/lib/ffmpeg";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success' | 'error';

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
}

const statusMessages = {
  waiting: 'Carregar vídeo',
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Socesso!',
  error: 'Ops! Ocorreu um erro.',
}

export function VideoInputForm({ onVideoUploaded }: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<Status>('waiting');

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFiles = files[0];
    setVideoFile(selectedFiles);
  }

  async function convertViewToAudio(video: File) {
    const ffmpeg = await getFFmpeg();

    // Informar o arquivo dentro da "máquina" para que o web assembly da lib entenda.
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ffmpeg.on('log', log => {
    //   console.log(log);
    // });

    ffmpeg.on('progress', progress => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100))
    });

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a', // Como só queremos pegar o audio do vídeo
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame', // Deixa o arquivo mais leve e com boa qualidade
      'output.mp3',
    ]);

    const data = await ffmpeg.readFile('output.mp3');

    // Converter o FileData em um File do JavaScript
    const audioFileBlob = new Blob([data], {
      type: 'audio/mpeg'
    });
    const auidoFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg'
    });

    return auidoFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    /**
     * Converter vídeo em áudio. 
      - OpenAI só suporta até 25MB.
      - Possibilidade de diminuir a qualidade do audio para que caiba mais audio dentro dos 25MB.
      - Upload para a OpenAI e back-end muito menor.
    **/

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    setStatus('converting');

    const audioFile = await convertViewToAudio(videoFile);

    const data = new FormData();
    data.append('file', audioFile);

    setStatus('uploading');

    const response = await api.post('/videos', data);

    const videoId = response.data?.video?.id;

    setStatus('generating');

    await api.post(`/videos/${videoId}/transcription`, {
      prompt
    });

    setStatus('success');

    onVideoUploaded(videoId);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label 
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {
          previewURL 
          ? (
            <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0 w-screen h-full" />
          )
          : (
            <>
              <FileVideo />
              Selecione um vídeo
            </>
          )
        }
      </label>
      <input 
        type="file" 
        id="video" 
        accept="video/mp4" 
        className="sr-only" 
        onChange={handleFileSelected} 
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de descrição</Label>
        <Textarea
          id="transcription_prompt"
          ref={promptInputRef}
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mensionadas no vídeo separadas por vírgula (,)"
          disabled={status !== 'waiting'}
        />
      </div>

      <Button 
        type="submit"
        data-success={status === 'success'}
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {statusMessages[status]}
        {status === 'waiting' && (<UploadIcon className="w-4 h-4 ml-2" />)}
      </Button>
    </form>
  )
}