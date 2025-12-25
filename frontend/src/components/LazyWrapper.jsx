import { Suspense } from 'react'
import LoadingModal from "./LoadingModal"

export default function LazyWrapper({ children }) {
  return (
    <Suspense fallback={<LoadingModal open={true} message="در حال بارگذاری ..." />}>
        {children}
    </Suspense>
  )
}
