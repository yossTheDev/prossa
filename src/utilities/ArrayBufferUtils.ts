export const ArrayBufferToString = (buf: ArrayBuffer) => {
	return String.fromCharCode.apply(
		null,
		new Uint16Array(buf) as unknown as number[]
	);
};

export const StringToArrayBuffer = (str: string) => {
	var buf = new ArrayBuffer(str.length * 2);
	var bufView = new Uint16Array(buf);

	for (let i = 0, strLenght = str.length; i < strLenght; i++) {
		bufView[i] = str.charCodeAt(i);
	}

	return buf;
};
