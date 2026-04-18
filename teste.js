async function lerNFC() {
  if ('NDEFReader' in window) {
    try {
      const ndef = new NDEFReader();
      await ndef.scan();

      console.log("Aproxime o NFC...");

      ndef.onreading = event => {
        const { message, serialNumber } = event;

        console.log("Tag ID:", serialNumber);

        for (const record of message.records) {
          const textDecoder = new TextDecoder(record.encoding);
          const data = textDecoder.decode(record.data);

          console.log("Conteúdo:", data);
        }
      };

    } catch (error) {
      console.error("Erro ao ler NFC:", error);
    }
  } else {
    alert("NFC não suportado neste dispositivo");
  }
}