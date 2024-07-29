--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: raum; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public.raum (
    raum_id integer NOT NULL,
    spieler_id1 integer,
    spieler_id2 integer,
    "Öffentlich" boolean DEFAULT false NOT NULL,
    passwort character varying(30),
    titel character varying(50) NOT NULL
);


ALTER TABLE public.raum OWNER TO testuser;

--
-- Name: raum_raum_id_seq; Type: SEQUENCE; Schema: public; Owner: testuser
--

CREATE SEQUENCE public.raum_raum_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.raum_raum_id_seq OWNER TO testuser;

--
-- Name: raum_raum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: testuser
--

ALTER SEQUENCE public.raum_raum_id_seq OWNED BY public.raum.raum_id;


--
-- Name: spieler; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public.spieler (
    spieler_id integer NOT NULL,
    alias character varying(255) NOT NULL,
    punktestand integer DEFAULT 0 NOT NULL,
);


ALTER TABLE public.spieler OWNER TO testuser;

--
-- Name: spieler_spieler_id_seq; Type: SEQUENCE; Schema: public; Owner: testuser
--

CREATE SEQUENCE public.spieler_spieler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spieler_spieler_id_seq OWNER TO testuser;

--
-- Name: spieler_spieler_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: testuser
--

ALTER SEQUENCE public.spieler_spieler_id_seq OWNED BY public.spieler.spieler_id;


--
-- Name: raum raum_id; Type: DEFAULT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public.raum ALTER COLUMN raum_id SET DEFAULT nextval('public.raum_raum_id_seq'::regclass);


--
-- Name: spieler spieler_id; Type: DEFAULT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public.spieler ALTER COLUMN spieler_id SET DEFAULT nextval('public.spieler_spieler_id_seq'::regclass);


--
-- Data for Name: raum; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public.raum (raum_id, spieler_id1, spieler_id2, "Öffentlich", passwort, titel) FROM stdin;
1	1	2	t	\N	Open Room 1
2	3	4	t	publicSecret	Open Room 2
3	5	1	f	\N	Private Room 1
4	2	3	f	privatePass	Private Room 2
5	4	5	t	\N	Open Room 3
6	1	3	f	\N	Private Room 3
7	2	5	t	openSesame	Open Room 4
8	3	1	f	hiddenGem	Private Room 4
\.


--
-- Data for Name: spieler; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public.spieler (spieler_id, alias, punktestand) FROM stdin;
1	PlayerOne	150
2	GamerGirl	200
3	ProGamer	250
4	CasualJoe	100
5	EliteSniper	300
\.


--
-- Name: raum_raum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: testuser
--

SELECT pg_catalog.setval('public.raum_raum_id_seq', 8, true);


--
-- Name: spieler_spieler_id_seq; Type: SEQUENCE SET; Schema: public; Owner: testuser
--

SELECT pg_catalog.setval('public.spieler_spieler_id_seq', 5, true);


--
-- Name: raum raum_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public.raum
    ADD CONSTRAINT raum_pkey PRIMARY KEY (raum_id);


--
-- Name: spieler spieler_alias_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public.spieler
    ADD CONSTRAINT spieler_alias_key UNIQUE (alias);


--
-- Name: spieler spieler_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public.spieler
    ADD CONSTRAINT spieler_pkey PRIMARY KEY (spieler_id);


--
-- Name: raum raum_spieler_id1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public.raum
    ADD CONSTRAINT raum_spieler_id1_fkey FOREIGN KEY (spieler_id1) REFERENCES public.spieler(spieler_id);


--
-- Name: raum raum_spieler_id2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public.raum
    ADD CONSTRAINT raum_spieler_id2_fkey FOREIGN KEY (spieler_id2) REFERENCES public.spieler(spieler_id);


--
-- PostgreSQL database dump complete
--

