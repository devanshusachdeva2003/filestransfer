import React from 'react'
import Link from 'next/link'
import { Download, List, Share2, ChevronUp } from "lucide-react"
const FileSteps: React.FC = () => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How to send and share large files with TransferNow?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
             <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center font-bold">1</div>
            <div className="flex items-start gap-4 mt-5">
             
              <div>
                <h3 className="text-lg font-semibold">Select your files to send</h3>
                <p className="mt-2 text-lg text-slate-600">Click on <strong>Start</strong> to select the files and documents to send or drag and drop them directly anywhere on our interface.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
             <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center font-bold">2</div>
            <div className="flex items-start gap-4 mt-5">
             
              <div>
                <h3 className="text-lg font-semibold">Fill-in our form</h3>
                <p className="mt-2 text-lg text-slate-600">Send files via email to your contacts or get a customizable shareable link. Our tool provides the adapted features in keeping with your needs.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
             <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center font-bold">3</div>
            <div className="flex items-start gap-4 mt-5">
             
              <div>
                <h3 className="text-lg font-semibold">Validate to transfer and start upload!</h3>
                <p className="mt-2 text-lg text-slate-600">When you have finished filling-in the file transfer form, click on <strong>Transfer</strong> to confirm your transfer information and start uploading your documents.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded shadow">Send files now</button>
        </div>
      </div>

      <div><h1 className='text-center text-3xl font-bold mt-20'>With a TransferNow account you can send and share even larger files!</h1>
      <p className='text-xl mt-10 text-gray-500'>TransferNow is the simplest, fastest and safest interface to transfer and share files. Send photos, videos and other large files without a manditory subscription thanks to TransferNow.</p>
      <p className='text-gray-500 text-xl mt-5'><span className='text-black'>Create a TransferNow account </span>to get higher transfer capacity and additional features. It is simple and secure!</p>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-15 max-w-6xl mx-auto ">
          <div className="bg-white rounded-2xl p-6 shadow-md">
             <img width="48" height="48" src="https://img.icons8.com/color/48/resize-horizontal--v1.png" alt="resize-horizontal--v1"/>
            <div className="flex items-start gap-4 mt-5">
             <div>
                <h3 className="text-lg font-semibold">Secure file transfer via email, or shareable links</h3>
                <p className="mt-2 text-lg text-slate-600">Send and share large files and other documents quickly and securely with our file transfer solution.<span className='text-black '> Send large files via email</span> or <span className='text-black'>create a simple sharing link </span>from any device (smartphone, tablet, computer) using just a web browser.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
           <img width="48" height="48" src="https://img.icons8.com/color/48/paper-plane.png" alt="paper-plane"/>
            <div className="flex items-start gap-4 mt-5">
              
              <div>
                <h3 className="text-lg font-semibold">Send large files up to 250 GB per transfer</h3>
                <p className="mt-2 text-lg text-slate-600">Get a TransferNow account to transfer large files and other sizable documents! The files are<span className='text-black '> available up to 365 days</span> before being automatically and permanently erased from our servers.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <img width="48" height="48" src="https://img.icons8.com/softteal-gradient/48/settings.png" alt="settings"/>
            <div className="flex items-start gap-4 mt-5">
            
              <div>
                <h3 className="text-lg font-semibold">Track your sent files. Manage your transfers.</h3>
                <p className="mt-2 text-lg text-slate-600">Use our complete dashboard to follow and track your file downloads over time. You can modify your transfers’ data and parameters,<span className='text-black'> re-transfer files</span> to new recipients without having to systematically re-upload the same documents and erase a transfer before it's initial expiration date.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-15 max-w-6xl mx-auto ">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <img width="48" height="48" src="https://img.icons8.com/fluency/48/group-foreground-selected.png" alt="group-foreground-selected"/>
            <div className="flex items-start gap-4 mt-5">
             <div>
                <h3 className="text-lg font-semibold">Use TransferNow to send files for your business</h3>
                <p className="mt-2 text-lg text-slate-600">Take advantage of our multi-user service subscriptions to ,<span className='text-black'>add or import your collaborators and additional users </span>so that they too can get a TransferNow account. Get an administrator account where you <span className='text-black'> will have complete managing control</span> over your users' access, white label customization, file reception and billing. You can also access the sending and receiving history of your business’ files.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
           <img width="48" height="48" src="https://img.icons8.com/fluency/48/download.png" alt="download"/>
            <div className="flex items-start gap-4 mt-5">
              
              <div>
                <h3 className="text-lg font-semibold">Integrate the TransferNow widget on your website and receive files easily.</h3>
                <p className="mt-2 text-lg text-slate-600">Discover our <span className='text-black'> form generator </span>to receive files directly on your account and customize the widget’s appearance as well as it's fields (text boxes, drop-down lists, checkboxes, radio buttons). You can get a simple <span className='text-black'>HTML code to integrate into your website</span> allowing you to receive files instantaneously.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
<img width="48" height="48" src="https://img.icons8.com/softteal-color/48/pencil.png" alt="pencil"/>            <div className="flex items-start gap-4 mt-5">
            
              <div>
                <h3 className="text-lg font-semibold">Customize your account with white label customization</h3>
                <p className="mt-2 text-lg text-slate-600">Create your <span className='text-black'> personalized web subdomain </span>(for example: https://mycompany.transfernow.net) add your logo and wallpaper to highlight ,<span className='text-black'> your brand image and/or graphic identity</span>. You can visually improve your account by adding your logo and color scheme for your transfer emails.,<span className='text-black'> Promote your firm’s vision</span> by customizing your account when you send and receive files.</p>
              </div>
            </div>
          </div>
        </div>
         <div className="mt-15 flex justify-center gap-5">
          <Link href="/freetrial" className="bg-indigo-600 text-white px-6 py-3 rounded shadow">Free trial</Link>
          <Link href="/compare" className="text-indigo-600 border border-indigo-600 px-6 py-3 rounded shadow">Compare our offers</Link>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-15 max-w-6xl mx-auto ">
          <div className="bg-white rounded-2xl p-6 shadow-md">
          <img width="48" height="48" src="https://img.icons8.com/color-pixels/32/lock.png" alt="lock"/>
            <div className="flex items-start gap-4 mt-5">
             <div>
                <h3 className="text-lg font-semibold">Protect your transfers with password</h3>
                <p className="mt-2 text-lg text-slate-600">Transfer your files by email or generate a shareable link and add a <span className='text-black'> password </span>to block access to your transfers'<span className='text-black'> download page.</span> In this case, concerning an email transfer, we do not communicate the password to your recipients and leave it to your discretion to forward it to your contacts.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
           <img width="48" height="48" src="https://img.icons8.com/color/48/america.png" alt="america"/>
            <div className="flex items-start gap-4 mt-5">
              
              <div>
                <h3 className="text-lg font-semibold">Select the region where your files will be stored and encrypted at rest (AES-256)</h3>
                <p className="mt-2 text-lg text-slate-600">Select the closest storage region for your files to get ,<span className='text-black'> the best performances</span> or pick the region of your choice in accordance with your contacts' and users' location. The ,<span className='text-black'> files stored on our cloud are encrypted at rest</span> with the AES-256 (Rijndael) algorithm.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-15 max-w-6xl mx-auto ">
          <div className="bg-white rounded-2xl p-6 shadow-md">
          <img width="48" height="64" src="https://img.icons8.com/arcade/64/user-shield.png" alt="user-shield"/>
            <div className="flex items-start gap-4 mt-5">
             <div>
                <h3 className="text-lg font-semibold">Use the preventive antivirus scan function to remove infected files</h3>
                <p className="mt-2 text-lg text-slate-600">In order to ,<span className='text-black'> protect your users and you</span>, we analyze the files at the end of each transfer before making them accessible for download, if there aren't any infected files found.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
           <img width="48" height="48" src="https://img.icons8.com/mini-stickers/48/image.png" alt="image"/>
            <div className="flex items-start gap-4 mt-5">
              
              <div>
                <h3 className="text-lg font-semibold">Send photos, upload and host images</h3>
                <p className="mt-2 text-lg text-slate-600">Share your family, professional, and all other photos with your friends, your family or any other recipient. <span className='text-black'>Send numerous photos</span> in high definition. Transfer images and photos without any loss in quality for your recipients!</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
           <img width="48" height="48" src="https://img.icons8.com/fluency/48/video--v1.png" alt="video--v1"/>
            <div className="flex items-start gap-4 mt-5">
            
              <div>
                <h3 className="text-lg font-semibold">Share and send your long videos</h3>
                <p className="mt-2 text-lg text-slate-600">Today, video recording quality is improving daily and the size of video files is also increasing. We thus end up with files as large as several Gbs. Luckily TransferNow enables you to <span className='text-black'>share videos of every size</span>.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-15 max-w-6xl mx-auto ">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <img width="40" height="40" src="https://img.icons8.com/office/40/circled-play.png" alt="circled-play"/>
            <div className="flex items-start gap-4 mt-5">
             <div>
                <h3 className="text-lg font-semibold">Previews and file streaming for your users</h3>
                <p className="mt-2 text-lg text-slate-600">Once your files are uploaded and your transfer is available for download, your users can <span className='text-black'>preview and stream the videos,</span> audio or other files such as PDF documents. For example, it is very useful before downloading hefty videos.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
          <img width="48" height="48" src="https://img.icons8.com/fluency/48/name--v1.png" alt="name--v1"/>
            <div className="flex items-start gap-4 mt-5">
              
              <div>
                <h3 className="text-lg font-semibold">Use your own address book</h3>
                <p className="mt-2 text-lg text-slate-600"><span className='text-black'>Facilitate recurring file sending </span>to the same contacts and recipients by adding or importing the contacts from your address book. In this way, you will save time by no longer having to systematically enter your contacts' emails.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
          <img width="48" height="48" src="https://img.icons8.com/fluency/48/list.png" alt="list"/>
            <div className="flex items-start gap-4 mt-5">
            
              <div>
                <h3 className="text-lg font-semibold">Create contact groups</h3>
                <p className="mt-2 text-lg text-slate-600">In addition to using your address book, you can create <span className='text-black'>contact groups and contacts </span> lists thus gaining in productivity for recurring transfers.</p>
              </div>
            </div>
          </div>
        </div>
          <section className="relative bg-[#f8f8fb] py-16 px-6 md:px-12 lg:px-20 mt-15">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">

        {/* LEFT */}
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2f2f35]">
            Integrate TransferNow to your website for file reception
          </h2>

          <p className="mt-8 text-lg text-[#4a4a52]">
            Discover our tool for creating <span className="text-black">customized forms</span> and then by adding a{" "}
            <span className="font-semibold">simple line of HTML code</span> on your internet site you can directly receive files.
          </p>

          <Link href="/freetrial" className="mt-10 inline-block rounded-xl bg-[#5963d5] px-7 py-4 text-lg font-semibold text-white hover:bg-[#4c56c8]">
            Free trial
          </Link>
        </div>

        {/* RIGHT */}
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-md">

         
          <FeatureRow
            icon={<Download className="h-8 w-8 text-[#5963d5]" />}
            text="Customize and integrate our widget to receive files from your clients or other contacts directly from your own website."
          />

          <FeatureRow
            border
            icon={<List className="h-8 w-8 text-[#5963d5]" />}
            text="Build your own file reception forms and add your customized fields."
          />

          <FeatureRow
            border
            icon={<Share2 className="h-8 w-8 text-[#5963d5]" />}
            text="The transferred files are stored on our secure cloud."
          />

        </div>
      </div>
    </section>
      </div>
    </section>
  )
}
type FeatureRowProps = {
  icon: React.ReactNode;
  text: string;
  border?: boolean;
};
function FeatureRow({ icon, text, border }: FeatureRowProps) {
  return (
    <div
      className={`grid grid-cols-[70px_1fr] gap-5 px-8 py-8 ${
        border ? "border-t border-gray-200" : ""
      }`}
    >
      <div>{icon}</div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
export default FileSteps