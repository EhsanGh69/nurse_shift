import { useState, useEffect } from 'react'
import { Fab, Zoom } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function BackToTop({ contentRef }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const content = contentRef?.current
        if(!content) return;

        const toggleVisibility = () => {
            if(content.scrollTop > 200)
                setVisible(true)
            else
                setVisible(false)
        }

        content.addEventListener("scroll", toggleVisibility)
        return () => content.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        if(contentRef?.current) {
            contentRef?.current.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    }

    return (
        <Zoom in={visible}>
            <Fab
                color='primary'
                onClick={scrollToTop}
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem"
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    )
}
