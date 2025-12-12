import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface VerificationModalProps {
    email: string;
    onVerified: () => void;
    onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ email, onVerified, onClose }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value[0]; // Solo tomar primer dígito
        }

        if (!/^\d*$/.test(value)) {
            return; // Solo permitir números
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus siguiente input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        pastedData.split('').forEach((digit, i) => {
            if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);

        // Focus último input
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            setError('Por favor ingresa el código completo');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/auth/verify-code`, {
                email,
                code: fullCode
            });

            alert(response.data.mensaje || 'Cuenta verificada exitosamente');
            onVerified();
        } catch (err: any) {
            setError(err.response?.data?.replace('Error: ', '') || 'Error al verificar el código');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="verification-modal">
                <button className="close-btn" onClick={onClose} type="button">×</button>

                <h2>Verifica tu email</h2>
                <p className="subtitle">
                    Hemos enviado un código de 6 dígitos a<br />
                    <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="code-inputs" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="code-input"
                            />
                        ))}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="verify-btn"
                        disabled={loading || code.join('').length !== 6}
                    >
                        {loading ? 'Verificando...' : 'Verificar código'}
                    </button>

                    <p className="resend-text">
                        ¿No recibiste el código? <button type="button" className="resend-link">Reenviar</button>
                    </p>
                </form>

                <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .verification-modal {
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 480px;
            width: 90%;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            color: #666;
            line-height: 1;
          }

          .close-btn:hover {
            color: #000;
          }

          .verification-modal h2 {
            margin: 0 0 8px 0;
            font-size: 28px;
            color: #1a1a1a;
            text-align: center;
          }

          .subtitle {
            text-align: center;
            color: #666;
            margin: 0 0 32px 0;
            line-height: 1.5;
          }

          .subtitle strong {
            color: #2d6a4f;
          }

          .code-inputs {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-bottom: 24px;
          }

          .code-input {
            width: 56px;
            height: 64px;
            font-size: 32px;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.2s;
          }

          .code-input:focus {
            outline: none;
            border-color: #2d6a4f;
            box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.1);
          }

          .error-message {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            text-align: center;
          }

          .verify-btn {
            width: 100%;
            padding: 16px;
            background: #2d6a4f;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .verify-btn:hover:not(:disabled) {
            background: #1b4332;
          }

          .verify-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .resend-text {
            text-align: center;
            margin: 16px 0 0 0;
            color: #666;
          }

          .resend-link {
            background: none;
            border: none;
            color: #2d6a4f;
            cursor: pointer;
            font-weight: 600;
            text-decoration: underline;
          }

          .resend-link:hover {
            color: #1b4332;
          }
        `}</style>
            </div>
        </div>
    );
};

export default VerificationModal;
