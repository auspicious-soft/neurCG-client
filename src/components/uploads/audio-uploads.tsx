'use client'
import { getMediaUrlFromFlaskProxy } from '@/utils'
import React, { useEffect } from 'react'
import ReactLoading from 'react-loading';

interface AudioUploadsProps {
    data: any
}

const AudioUploads = (props: AudioUploadsProps) => {
    const { data } = props
    const [uploadedAudios, setUploadedAudios] = React.useState<Record<string, string>>({})
    useEffect(() => {
        const fetchUploadedAudios = async () => {
            if (Array.isArray(props?.data)) {
                const audiosPromise = props.data.map(async (project: any) => {
                    const audioUrl = await getMediaUrlFromFlaskProxy(project?.audio);
                    return { projectId: project._id, audioUrl }
                })
                const audioResultsArrayOfObjects = await Promise.all(audiosPromise);
                const audioResults = audioResultsArrayOfObjects.reduce((acc: any, curr: any) => {
                    acc[curr.projectId] = curr.audioUrl;
                    return acc;
                }, {})
                setUploadedAudios(audioResults)
            }
        }
        fetchUploadedAudios()
    }, [props, props?.data])
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
            {
                Object.keys(uploadedAudios).length > 0 ?
                    Object.entries(uploadedAudios).map(([projectId, audioUrl]) => (
                        <div key={projectId} className="flex justify-center items-center p-2 border border-gray-300 rounded bg-gray-100">
                            <audio controls className="w-full">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))
                    :
                    <div className="text-center">No audios uploaded yet</div>
            }
        </div>
    )
}

export default AudioUploads