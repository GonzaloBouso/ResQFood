import { useState } from 'react';

const faqs = {
  "Usuarios generales": [
    {
      question: "¿Cómo me registro en ResQFood?",
      answer: "Podés registrarte haciendo clic en 'Registro / Iniciar sesión' y completando el formulario con tus datos."
    },
    {
      question: "¿Qué tipo de alimentos puedo recibir?",
      answer: "Podés recibir todo tipo de alimentos disponibles en la plataforma, que cumplen con normas de seguridad alimentaria."
    },
    {
      question: "¿Es seguro recibir alimentos donados?",
      answer: "Sí, los alimentos pasan por controles básicos y los donantes tienen una calificación basada en reseñas."
    },
    {
      question: "¿Tiene algún costo?",
      answer: "No, recibir alimentos a través de ResQFood es completamente gratuito para los usuarios."
    }
  ],
  "Locales gastronómicos": [
    {
      question: "¿Cómo funciona para locales?",
      answer: "Los locales pueden registrarse como donantes y subir sus productos disponibles para donar a través del panel de donación."
    }
  ]
};

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Preguntas Frecuentes</h1>
      <p className="text-sm text-gray-600 mb-4">
        ¿Tienes dudas? Aquí respondemos lo más común entre nuestra comunidad.
      </p>

      <input
        type="text"
        placeholder="🔍 Buscar preguntas"
        className="w-full border rounded-md px-4 py-2 mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.entries(faqs).map(([category, items], catIdx) => (
        <div key={category} className="mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">{category}</h2>
          <div className="border rounded-md divide-y">
            {items
              .filter(faq => faq.question.toLowerCase().includes(search.toLowerCase()))
              .map((faq, idx) => {
                const index = `${catIdx}-${idx}`;
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="p-4">
                    <button
                      onClick={() => toggle(index)}
                      className="w-full text-left font-medium flex justify-between items-center"
                    >
                      {faq.question}
                      <span>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      <div className="text-sm mt-6">
        ¿Aún tienes dudas? <a href="/formulariocontacto" className="text-blue-600 underline">Contáctanos</a>
      </div>
    </div>
  );
}
