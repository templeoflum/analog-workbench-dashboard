import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Analog Workbench — Cadet VII',description:'Evidence-based progress and interactive circuit examples for the Phosphlux restart.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
