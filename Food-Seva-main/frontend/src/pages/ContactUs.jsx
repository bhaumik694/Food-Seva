import React from 'react';
import house from '../assets/Contact Us/house.png';
import phone from '../assets/Contact Us/phone.png';
import email from '../assets/Contact Us/email.png';
const ContactUs = () => {
    return (
        <div className="container">

            <div className="min-h-screen bg-[#eeecdd] text-white px-80 py-10">
                <div className="text-center mb-10 mt-5">
                    <h2 className="text-4xl font-bold text-black">Contact Us</h2>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8 ">

                    <div className="flex-1">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 mt-20">
                                <div className="bg-white text-black p-2 rounded-full">
                                    <img src={house} alt="" height={20} width={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800">Address</h3>
                                    <p className="text-black">4671 Sugar Camp Road, Owatonna, Minnesota, 55060</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white text-black p-2 rounded-full">
                                    <img src={phone} alt="" height={20} width={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800">Phone</h3>
                                    <p className="text-black">561-456-2321</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white text-black p-2 rounded-full">
                                    <img src={email} alt="" height={20} width={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800">Email</h3>
                                    <p className="text-black">example@email.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white text-black p-8 rounded-lg shadow-lg w-full md:w-1/2 md:mr-5">
                        <h2 className="text-2xl font-bold mb-4">Send Message</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Full Name</label>
                                <input type="text" className="w-full mt-2 border-b-2 p-2 border-gray-400 focus:outline-none" placeholder="Full Name" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Email</label>
                                <input type="email" className="w-full mt-2 border-b-2 p-2 border-gray-400 focus:outline-none" placeholder="Email" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Phone Number</label>
                                <input type="tel" className="w-full mt-2 border-b-2 p-2 border-gray-400 focus:outline-none" placeholder="Phone Number" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Message</label>
                                <input type="text" className="w-full mt-2 border-b-2 p-2 border-gray-400 focus:outline-none" placeholder="Type your Message..." />
                            </div>
                            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ContactUs;