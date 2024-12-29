'use client'
import NFTsTopPrice from '@/components/nfts/NFTsTopPrice'
import NFTColections from '@/components/nfts/NFTColections'
import { useGetCollectionsByAddressQuery, useGetCollectionsQuery, useGetPendingCollectionsByAddressQuery, useRegisterPendingCollectionMutation } from '@/redux/features/api/apiSlice'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components//ui/tabs'
import { PlusIcon, UploadIcon } from '@radix-ui/react-icons'
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { FileCollection } from '@/lib/type'
import { useGetJsonDataQuery } from '@/redux/features/data/dataSlice'
import { skipToken } from '@reduxjs/toolkit/query'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import MyNFTColections from '@/components/nfts/MyNFTColections'
import NFTColectionsPending from '@/components/nfts/NFTColectionsPending'

const heardPersonal = 'Register Collection'
const note = 'No content. Please upload file!'
export default function NFTs() {
    const { address } = useAccount()
    const { data: collections, isFetching } = useGetCollectionsQuery()
    const { data: myCollecttions } = useGetCollectionsByAddressQuery(address ?? skipToken)
    const { data: myPendingCollections } = useGetPendingCollectionsByAddressQuery(address ?? skipToken)
    const [file, setFile] = useState<File | undefined>(undefined)
    const [fileContent, setFileContent] = useState<FileCollection | undefined>(undefined)
    const { data: newCollection } = useGetJsonDataQuery(fileContent?.uri ?? skipToken)
    const { showError, showSuccess } = useToast()
    const [registerPendingCollection, { isSuccess: isSuccessRegisterCollection, isError: isErrorRegisterCollection }] = useRegisterPendingCollectionMutation()

    useEffect(() => {
        if (isSuccessRegisterCollection) {
            showSuccess("Collection Register Is Success!")
        }
        if (isErrorRegisterCollection) {
            showError("Collection Register Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessRegisterCollection, isErrorRegisterCollection])

    const handleRegisterCollection = () => {
        const content = { owner: address, ...fileContent }
        registerPendingCollection(content as FileCollection)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0]
            if (selectedFile.type !== 'application/json') {
                showError('Please upload file *.json')
                return
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                showError('File too size, limit size < 5MB')
                return
            }
            setFile(selectedFile);
            setFileContent(undefined);
        }
    }

    const handleUpload = () => {
        if (!file) {
            showError("Please choose file before upload!");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (typeof content === "string") {
                try {
                    const parsedData: FileCollection = JSON.parse(content);
                    setFileContent(parsedData);
                    showSuccess("Upload success!");
                    console.log("File content:", content);
                } catch {
                    showError("Error parsing JSON!.");
                }
            }
        }
        reader.onerror = (error) => {
            showError("Error in read file.");
            console.log("Error: ", error)
        };
        reader.readAsText(file);
    }

    return (
        <Tabs defaultValue="market" className="flex flex-col justify-center py-[1vw]">
            <TabsList className="flex flex-row select-none justify-center items-center mx-[40%]">
                <TabsTrigger value="market" className="w-[50%] h-full">Market</TabsTrigger>
                <TabsTrigger value="personal" className="w-[50%] h-full">Personal</TabsTrigger>
            </TabsList>
            <TabsContent value="market" className="w-full">
                <div className='flex flex-col justify-start items-center w-full min-h-[100vh] px-[15vw] py-[2vw] space-y-[2vw]'>
                    <div className='w-full'>
                        <NFTsTopPrice />
                    </div>
                    {!isFetching && collections &&
                        <div className='w-full'>
                            <NFTColections collections={collections} />
                        </div>
                    }
                </div>
            </TabsContent>
            <TabsContent value="personal" className="w-full">
                <div className='select-none flex flex-col justify-start items-center w-full min-h-[100vh] px-[15vw] py-[2vw] space-y-[2vw]'>
                    <div className='flex flex-row justify-end items-center w-full'>
                        <AlertDialog >
                            <AlertDialogTrigger asChild>
                                <div className='cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-white/15 hover:dark:bg-white/20 flex flex-row justify-center items-center space-x-[0.5vw] rounded-2xl p-[1vw] text-white'>
                                    <PlusIcon className='w-[1.5vw] h-[1.5vw]' />
                                    <p>{heardPersonal}</p>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="select-none w-[25vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                <AlertDialogHeader className="bg-fixed w-full">
                                    <AlertDialogTitle className='flex flex-row justify-center'>Register Collection</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                    <div className='border-[1px] w-full flex flex-row justify-center items-center rounded-2xl h-[10vw]'>
                                        {
                                            newCollection ?
                                                <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                    <Image src={newCollection?.collection_logo || '/image/defaul-image.png'} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                    <p className='font-semibold'>{newCollection.name}</p>
                                                </div>
                                                :
                                                <p>{note}</p>
                                        }
                                    </div>
                                    <div className="flex flex-row justify-center items-center w-full space-x-[1vw]">
                                        <Input onChange={handleFileChange} type='file' />
                                        <Button onClick={handleUpload} variant="outline" className={`${file ? "bg-blue-500 hover:bg-blue-600 dark:bg-white/15 hover:dark:bg-white/20 text-white hover:text-white" : ""}`}>
                                            <UploadIcon className='w-[1vw] h-[1vw]' />
                                            <p>Upload</p>
                                        </Button>
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel >Close</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRegisterCollection} >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    {myCollecttions &&
                        <div className='w-full'>
                            <MyNFTColections collections={myCollecttions} />
                        </div>

                    }
                    {myPendingCollections &&
                        <div className='w-full'>
                            <NFTColectionsPending collections={myPendingCollections} />
                        </div>
                    }
                </div>
            </TabsContent>
        </Tabs >
    )
}