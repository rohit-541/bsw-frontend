import { Link, useNavigate } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Globe, Mail, School, Phone, BookOpen, Building2 } from "lucide-react"
import { Navigate } from "react-router-dom"
export default function Footer() {
    const navigate = useNavigate();
    const BSWClick=()=>{
        navigate('/home');
    }
    return (
        <footer className="bg-black text-gray-300 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left Section */}
                    <div >
                        <h2 onClick={BSWClick} className="text-3xl hover:cursor-pointer font-bold mb-4 text-white">BSW Academic Portal</h2>
                        <div className="flex gap-4 mb-2">
                            <Link href="#" className="hover:text-white">
                                <Twitter className="w-5 h-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Facebook className="w-5 h-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Instagram className="w-5 h-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Linkedin className="w-5 h-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                        <p className="mb-4">
                            BSW Coordinator{" "}
                            <a href="https://www.linkedin.com/in/aryan-sharma-326657230?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" className="text-teal-400 hover:text-teal-300">
                                Aryan Sharma
                            </a><br />
                            BSW Secretary{" "}
                            <a href="https://www.linkedin.com/in/jivant-garg-a9225a24a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" className="text-teal-400 hover:text-teal-300">
                                Jivant Garg
                            </a>
                        </p>
                        <p className="mb-4">
                            Website Created and Maintained by{" "}
                            <a href="https://www.linkedin.com/in/sarvik-mehta-72267a28a/" target="_blank" className="text-teal-400 hover:text-teal-300">
                                Sarvik Mehta
                            </a>{" "}
                            and{" "}
                            <a href="https://www.linkedin.com/in/rohit-kumar-ab0b412b7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" className="text-teal-400 hover:text-teal-300">
                                Rohit
                            </a>
                        </p>
                        <p className="mb-4">
                            Designed by{" "}
                            <a href="https://www.linkedin.com/in/lakshay-aa7510293/" target="_blank" className="text-teal-400 hover:text-teal-300">
                                Lakshay
                            </a>{", "}
                            <a href="https://www.linkedin.com/in/harshit-gour-532b84291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" className="text-teal-400 hover:text-teal-300">
                                Harshit
                            </a>{" "}
                            and{" "}
                            <a href="https://www.linkedin.com/in/devesh-sharma-bb931730a/" target="_blank" className="text-teal-400 hover:text-teal-300">
                                Devesh
                            </a>
                        </p>

                    </div>

                    {/* Middle Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-teal-400">Useful Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="https://bsw.iitd.ac.in/mental_health.php" target="_blank" className="flex items-center gap-2 hover:text-teal-400">
                                    <School className="w-4 h-4" />
                                    YourDOST & SCS
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 hover:text-teal-400">
                                    <Phone className="w-4 h-4" />
                                    Emergency Contacts
                                </a>
                            </li>
                            <li>
                                <a href="https://eacademics.iitd.ac.in/sportal/login" target="_blank" className="flex items-center gap-2 hover:text-teal-400">
                                    <BookOpen className="w-4 h-4" />
                                    eAcademics
                                </a>
                            </li>
                            <li>
                                <a href="https://webmail.iitd.ernet.in/roundcube/" target="_blank" className="flex items-center gap-2 hover:text-teal-400">
                                    <Mail className="w-4 h-4" />
                                    Webmail
                                </a>
                            </li>
                            <li>
                                <a href="https://moodle.iitd.ac.in/login/index.php" target="_blank" className="flex items-center gap-2 hover:text-teal-400">
                                    <Globe className="w-4 h-4" />
                                    Moodle
                                </a>
                            </li>
                            <li>
                                <a href="https://ngu.iitd.ac.in/index" target="_blank" className="flex items-center gap-2 hover:text-teal-400">
                                    <Building2 className="w-4 h-4" />
                                    NGU
                                </a>
                            </li>
                            <li>
                                <a href="https://helpline.iitd.ac.in/" target="_blank" className="flex items-center gap-2 hover:text-teal-400">
                                    <Phone className="w-4 h-4" />
                                    IITD Helpline
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-teal-400">Feedback</h3>
                        <p className="mb-2">Please give us your suggestions and feedback.</p>
                        <p className="mb-4">Constructive Criticism will be appreciated.</p>
                        <a href="https://docs.google.com/forms/u/0/d/1_QZNApfKMbt6IW34kROkuoYN-hf4XRWArD_l2J0xQMw/viewform?edit_requested=true" target="_blank" className="text-teal-400 hover:text-teal-300">
                            Click here
                        </a>
                        <span className="text-gray-300"> for the feedback form</span>

                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-2 text-white">BSW Constitution</h3>
                            <p>
                                <a href="https://bsw.iitd.ac.in/stuff/Constitution.pdf" target="_blank" className="text-teal-400 hover:text-teal-300">
                                    Read
                                </a>{" "}
                                our Constitution
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
                    <p className="mb-2">
                        © Copyright <span className="font-semibold">BSW 2025</span> All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    )
}

