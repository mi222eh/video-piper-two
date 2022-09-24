import { ReactNode } from "react";

/**
 * A component that centers its children
 */
export function Center(props: { children: ReactNode }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            {props.children}
        </div>
    );
}
