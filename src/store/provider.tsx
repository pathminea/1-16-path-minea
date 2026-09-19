"use client"

import React, { useState } from "react";
import { makeStore } from ".";
import type { AppStore } from ".";
import { Provider } from "react-redux";

export function StoreProvider({
    children,
}:{
    children: React.ReactNode
})
{
    const [store] = useState<AppStore>(() => makeStore());

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}