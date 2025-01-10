'use client'
import { useCollection } from "@/hooks/useCollection"
import { useGetNFTByPendingCollectionQuery, useGetPendingNFTItemQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query";
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FileContentUpdateExpertPriceNFT, PendingNFT } from "@/lib/type";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useUpdatePricePendingNFTMutation } from "@/redux/features/admin/adminSlice";
import { useToast } from "@/hooks/useToast";
import { PlusIcon, UploadIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";

const options = [
    {
        name: 'Item'
    },
    {
        name: 'AI Price'
    },
    {
        name: 'Expert Price'
    },
    {
        name: 'Price'
    },
    {
        name: 'Action'
    },
]
const infoNft = [
    'Collection',
    'NFT ID',
    'AI Price',
    'Expert Price',
    'Price',
    'Created At'
]

const titleButton = 'Upload All Price Expert'
const note = 'No content. Please upload file!'
export default function CollectionNFTAdmin() {
    const { currentPendingCollection } = useCollection()
    const { showSuccess, showError } = useToast()
    const { data: nfts } = useGetNFTByPendingCollectionQuery(currentPendingCollection?._id ?? skipToken)
    const [currentNft, setCurrentNft] = useState<PendingNFT | undefined>(undefined)
    const { data: nowNft } = useGetPendingNFTItemQuery(currentPendingCollection?._id && currentNft ? { collectionId: currentPendingCollection?._id as string, nftId: currentNft.nft_id as string } : skipToken)
    const [updatePrice, setUpdatePrice] = useState<string>('')
    const [updatePricePendingNFT, { isSuccess: isSuccessUpdatePricePendingNFT, isError: isErrorUpdatePricePendingNFT }] = useUpdatePricePendingNFTMutation()
    const [file, setFile] = useState<File | undefined>(undefined)
    const [fileContent, setFileContent] = useState<FileContentUpdateExpertPriceNFT | undefined>(undefined)

    useEffect(() => {
        if (isSuccessUpdatePricePendingNFT) {
            showSuccess("Update Price Pending NFT Is Success!")
        }
        if (isErrorUpdatePricePendingNFT) {
            showError("Update Price Pending NFT Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdatePricePendingNFT, isErrorUpdatePricePendingNFT])

    const handleUpdateExpertPrice = async () => {
        if (currentNft && parseFloat(updatePrice) > 0) {
            const list = [
                {
                    pending_collection_id: currentPendingCollection?._id as string,
                    nft_id: currentNft.nft_id,
                    expert_price: updatePrice
                }]
            await updatePricePendingNFT(list)
        }
        setCurrentNft(undefined)
        setUpdatePrice("")
    }

    const handleUpdateFileExpertPrice = async () => {
        if (fileContent && fileContent.collection_id === currentPendingCollection?._id) {

            const list = fileContent.nfts.map(item => ({
                pending_collection_id: fileContent.collection_id,
                nft_id: item.nft_id,
                expert_price: item.expert_price
            }))
            await updatePricePendingNFT(list)
        } else {
            showError("Error content file. Checking collection before update!")
        }
        setFile(undefined)
        setFileContent(undefined)
    }

    const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatePrice(e.target.value)
    }

    const handleSetCurrentNft = (nft: PendingNFT) => {
        setCurrentNft(nft)
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
                    const parsedData: FileContentUpdateExpertPriceNFT = JSON.parse(content);
                    setFileContent(parsedData);
                    showSuccess("Upload success!");
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
        <div className="select-none flex flex-col max-h-[70vh] space-y-[1vw]">
            {currentPendingCollection?.status === 'Pending Expert' &&
                <div className='flex flex-row justify-end items-center w-full'>
                    <AlertDialog >
                        <AlertDialogTrigger asChild>
                            <div className='cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-white/15 hover:dark:bg-white/20 flex flex-row justify-center items-center space-x-[0.5vw] rounded-2xl p-[1vw] text-white'>
                                <PlusIcon className='w-[1.5vw] h-[1.5vw]' />
                                <p>{titleButton}</p>
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="select-none w-[30vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                            <AlertDialogHeader className="bg-fixed w-full">
                                <AlertDialogTitle className='flex flex-row justify-center'>Register Collection</AlertDialogTitle>
                                <VisuallyHidden>
                                    <AlertDialogDescription>Form Collection Admin</AlertDialogDescription>
                                </VisuallyHidden>
                            </AlertDialogHeader>
                            <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                <div className='w-full flex flex-row justify-center items-center min-h-[10vh]:'>
                                    {
                                        fileContent ?
                                            <Textarea disabled value={JSON.stringify(fileContent, null, 4) || ""} className="w-full text-xl text-black h-[40vh] rounded-2xl" />
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
                                <AlertDialogAction onClick={handleUpdateFileExpertPrice} >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
            <div className="flex flex-row justify-between items-center text-sm font-semibold opacity-60 h-[3vw]">
                {options.map((option, index) => {
                    if (currentPendingCollection?.status === 'Pending Expert') {
                        return (
                            <div key={index} className="flex flex-row justify-start items-center w-[20%]">
                                {option.name}
                            </div>
                        )
                    } else {
                        if (option.name !== 'Action') {
                            return <div key={index} className="flex flex-row justify-start items-center w-[25%]">
                                {option.name}
                            </div>
                        }
                    }
                })}
            </div>
            <div className="flex flex-col flex-start border-t-[1px]">
                {nfts?.length && nfts.map((nft, index) => {
                    const isPending = currentPendingCollection?.status === 'Pending Expert'
                    return (
                        <div key={index} className="flex flex-row justify-between items-center w-full hover:bg-secondary/80 py-[0.5vw]">
                            <Dialog >
                                <DialogTrigger className={`flex justify-around items-center h-full ${isPending ? "w-[80%]" : "w-full"}`} onClick={() => handleSetCurrentNft(nft)}>
                                    <div className='hover:underline flex flex-row border-none outline-none select-none w-full px-0 mx-0'>
                                        <div className="flex flex-row justify-start items-center w-[25%] h-full space-x-[0.5vw]">
                                            <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={25} height={25} className="object-cover rounded-xl h-[4vw] w-[4vw]" />
                                            <div>{nft.name ? nft.name : `#${nft.nft_id}`}</div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center space-x-[0.4vw] w-[25%]">
                                            <p>{parseFloat(nft.ai_price) > 0 ? nft.ai_price : ""}</p>
                                            <p className="text-md font-semibold">ETH</p>
                                        </div>
                                        <div className="flex flex-row justify-start items-center space-x-[0.4vw] w-[25%]">
                                            <p>{parseFloat(nft.expert_price) > 0 ? nft.expert_price : ""}</p>
                                            <p className="text-md font-semibold">ETH</p>
                                        </div>
                                        <div className="flex flex-row justify-start items-center space-x-[0.4vw] w-[25%]">
                                            <p>{parseFloat(nft.price) > 0 ? nft.price : ""}</p>
                                            <p className="text-md font-semibold">ETH</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="select-none bg-transparent max-w-[70vw] max-h-[70vw] p-0 m-0 rounded-2xl border-none">
                                    <VisuallyHidden>
                                        <DialogTitle>Pending NFT</DialogTitle>
                                        <DialogDescription>{nft.description}</DialogDescription>
                                    </VisuallyHidden>
                                    <div className="flex flex-row w-full space-x-[1vw]">
                                        <div className="flex flex-col w-[30%] bg-white/10 rounded-2xl text-white px-3 py-[2vw] space-y-[1vw]">
                                            <div className="flex flex-col justify-center items-center">
                                                <p className="text-xl font-semibold">{nowNft?.name ? nowNft.name : `${currentPendingCollection?.name} #${nft.nft_id}`}</p>
                                            </div>
                                            <div className="flex flex-col justify-center items-center border-t-[0.1px] py-[0.5vw] space-y-[0.4vw]">
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[0]}</p>
                                                    <p>{currentPendingCollection?.name}</p>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[1]}</p>
                                                    <p>{nowNft?.nft_id}</p>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[2]}</p>
                                                    <div className="flex flex-row space-x-1">
                                                        <p>{parseFloat(nowNft?.ai_price || "") > 0 ? nowNft?.ai_price : ""}</p>
                                                        <p>{currentPendingCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[3]}</p>
                                                    <div className="flex flex-row space-x-1">
                                                        <p>{parseFloat(nowNft?.expert_price || "") > 0 ? nowNft?.expert_price : ""}</p>
                                                        <p>{currentPendingCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[4]}</p>
                                                    <div className="flex flex-row space-x-1">
                                                        <p>{parseFloat(nowNft?.price || "") > 0 ? nowNft?.price : ""}</p>
                                                        <p>{currentPendingCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[5]}</p>
                                                    <div className="flex flex-row space-x-1 italic">
                                                        <p>{(new Date(nowNft?.createdAt || '')).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-1 border-t-[0.1px] py-[0.5vw]">
                                                <p className="text-md font-semibold">Traits</p>
                                                <div className="flex flex-wrap justify-between gap-y-2 gap-x-1 border-[1px] border-white/40 rounded-2xl p-2">
                                                    {nowNft?.traits && nowNft.traits.length > 0 && nowNft.traits.map((item, index) => {
                                                        return (
                                                            <div className="bg-white/15 w-[49%] flex flex-col justify-center items-center rounded-2xl py-[0.5vw]" key={index}>
                                                                <p className="text-lg font-semibold">{item.trait_type}</p>
                                                                <p>{item.value}</p>
                                                            </div>)
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-1 border-t-[0.1px] py-[0.5vw]">
                                                <p className="text-md font-semibold">Description</p>
                                                <div className="flex border-[1px] text-sm text-wrap border-white/40 rounded-2xl p-3 max-h-[20vh] min-h-[15vh]">
                                                    {nowNft?.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row w-[70%]">
                                            <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-full rounded-2xl" />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {
                                currentPendingCollection?.status === 'Pending Expert' &&
                                <div className="flex justify-start items-center w-[20%]">
                                    <AlertDialog >
                                        <AlertDialogTrigger asChild>
                                            <Button variant='outline' onClick={() => handleSetCurrentNft(nft)}>Update Expert Price</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                            <AlertDialogHeader className="flex flex-row justify-center w-full">
                                                <AlertDialogTitle className="text-xl">Update Expert Price NFT</AlertDialogTitle>
                                                <VisuallyHidden>
                                                    <AlertDialogDescription>Form Collection Admin</AlertDialogDescription>
                                                </VisuallyHidden>
                                            </AlertDialogHeader>
                                            <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                <Image src={currentNft?.img || "/image/default-image.png"} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                <p className='font-semibold'>{currentNft?.name ? currentNft?.name : `${currentPendingCollection?.name} #${currentNft?.nft_id}`}</p>
                                                <div className="flex flex-col w-full space-y-[0.5vw]">
                                                    <p className="w-full flex flex-row justify-start text-sm">Update Expert Price</p>
                                                    <Input type="number" placeholder="ex: 1 ETH" value={updatePrice} onChange={handleChangePrice} />
                                                </div>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel >Close</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleUpdateExpertPrice} >Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}