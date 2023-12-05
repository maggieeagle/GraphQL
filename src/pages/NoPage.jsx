import * as React from 'react';
import { Navigate } from "react-router-dom";

export default function NoPage() {
  return (
      <Navigate to="/dashboard" />
  )
}
