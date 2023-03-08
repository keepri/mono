import { type JSXElement } from "solid-js";
import { mount, StartClient } from "solid-start/entry-client";

mount((): JSXElement => <StartClient />, document);
